import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import HeaderSection from './HeaderSection';
import DetailSection from './DetailSection';
import { saveSalesData } from '../redux/actions';
import axios from 'axios';
import jsPDF from 'jspdf';
import "./SalesEntryForm.css";

const SalesEntryForm = () => {
  const dispatch = useDispatch();
  const reduxFormData = useSelector((state) => state.salesData);
  const [itemList, setItemList] = useState([]);
  const [localFormData, setLocalFormData] = useState({
    header: {
      vr_no: 0,
      vr_date: '',
      ac_name: '',
      ac_amt: 0,
      status: '',
    },
    detail: [],
  });

  useEffect(()=>{

  },[reduxFormData]);

  const handleHeaderChange = (name, value) => {
    setLocalFormData((prevData) => ({
      ...prevData,
      header: {
        ...prevData.header,
        [name]: value,
      },
    }));
  };

  const getTotalAmount = (details) => {
    return details.reduce((total, detail) => {
      const amount = detail.qty * detail.rate;
      return total + amount;
    }, 0);
  };

  const [totalAmount, setTotalAmount] = useState(0);

  const handleDetailChange = (index, name, value) => {
    setLocalFormData((prevData) => {
      const updatedDetail = [...prevData.detail];
      updatedDetail[index] = {
        ...updatedDetail[index],
        [name]: value,
      };

      // Update the total amount whenever the detail changes
      const newTotalAmount = getTotalAmount(updatedDetail);
      setTotalAmount(newTotalAmount);

      return {
        ...prevData,
        detail: updatedDetail,
      };
    });
  };

  const handleAddDetail = () => {
    // Create a unique item code for the new row
    const uniqueItemCode = `NEW_ITEM_${localFormData.detail.length + 1}`;

    // Create a new empty detail object with the unique item code
    const newDetail = {
      item_code: uniqueItemCode,
      item_name: '', // You may want to set a default value or fetch it from the server
      description: '',
      qty: 0,
      rate: 0,
    };

    // Update local form data with the new detail
    setLocalFormData((prevData) => ({
      ...prevData,
      detail: [...prevData.detail, newDetail],
    }));
  };

  const handleRemoveDetail = (index) => {
    setLocalFormData((prevData) => {
      const updatedDetail = [...prevData.detail];
      updatedDetail.splice(index, 1);
      return {
        ...prevData,
        detail: updatedDetail,
      };
    });
  };

  const handleSubmit = async () => {
    try {
      
      // If the user hasn't made any changes, set default values
      if (!localFormData.header.vr_no) {
        const vr = document.getElementById("voucherNumber").value;
        setLocalFormData((prevData) => ({
          ...prevData,
          header: {
            ...prevData.header,
            vr_no: vr,
          },
        }));
      }
      if (!localFormData?.header.vr_date) {
        const todayDate = new Date().toISOString().split('T')[0];
        setLocalFormData((prevData) => ({
          ...prevData,
          header: {
            ...prevData.header,
            vr_date: todayDate,
          },
        }));
      }
      if (!localFormData?.header.status) {
        setLocalFormData((prevData) => ({
          ...prevData,
          header: {
            ...prevData.header,
            status: "A",
          },
        }));
      }

      if (!localFormData?.header.ac_name || !localFormData?.header.ac_amt) {
        alert("Please fill out all necessary fields before submitting!!!");
      }

      localFormData?.detail.forEach((dt) => {
        if (!dt.description || !dt.qty || !dt.rate) {
          alert("Please fill out all necessary fields before submitting!!!");
        }
      })
      
      console.log(localFormData);
      // Additional check to handle potential null or non-iterable values
      const headerData = localFormData?.header || {};
      const detailData = Array.isArray(localFormData?.detail) ? localFormData.detail : [];
      const totalAmount = getTotalAmount(detailData);
  
      // Dispatch the action to update the Redux store
      dispatch(saveSalesData({
        header: headerData,
        detail: detailData,
        totalAmount: totalAmount,
      }));
  
      // API request to save data to the server
      const response = await axios.post('http://5.189.180.8:8010/header/multiple', {
        header_table: headerData,
        detail_table: detailData,
      });
  
      console.log('Data saved successfully:', response.data);
  
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handlePrint = () => {
    // Create a new jsPDF instance
    const pdfDoc = new jsPDF();

    // Add content to the PDF
    pdfDoc.text(`Voucher Number: ${localFormData.header.vr_no}`, 10, 10);
    pdfDoc.text(`Voucher Date: ${localFormData.header.vr_date}`, 10, 20);
    pdfDoc.text(`Account Name: ${localFormData.header.ac_name}`, 10, 30);

    // Add details to the PDF
    localFormData.detail.forEach((detail, index) => {
      const yPos = 40 + index * 10;
      pdfDoc.text(`Item ${index + 1}: ${detail.item_name}, Qty: ${detail.qty}, Rate: ${detail.rate}`, 10, yPos);
    });

    // Save the PDF
    pdfDoc.save('sales_invoice.pdf');
  };

  const isDataSaved = localFormData.header.vr_no || (localFormData.detail && localFormData.detail.length > 0);

  return (
    <div className="sales-entry-form">
      <HeaderSection data={localFormData.header} onChange={handleHeaderChange} totalAmount={totalAmount} />
      {localFormData.detail && (
        <DetailSection
          data={localFormData.detail}
          onChange={handleDetailChange}
          onAdd={handleAddDetail}
          onRemove={handleRemoveDetail}
          updateTotalAmount={setTotalAmount}

        />
      )}

      <button onClick={() => {window.location.reload()}} className='button btn btn-primary' id='newbtn'>New</button>
      <button onClick={handleSubmit} className='button btn btn-success' id='savebtn'>Save</button>
      {isDataSaved && (
          <button onClick={handlePrint} className='button btn btn-secondary' id='printbtn'>Print</button>
        )}
    </div>
  );
};

export default SalesEntryForm;
