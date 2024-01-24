import React, { useState, useEffect } from 'react';

const HeaderSection = ({ data, onChange, totalAmount }) => {
    const [randomVrNo, setRandomVrNo] = useState('');

    useEffect(() => {
        const voucherNumber = generateRandomVrNo();
        setRandomVrNo(voucherNumber);
        // calculateAndSetAccountAmount();
    }, []);

    useEffect(() => {
      // Recalculate and set the account amount whenever the data changes
      onChange('ac_amt', totalAmount);
    }, [totalAmount]);

    const calculateAndSetAccountAmount = () => {
      if (data.detail) {
        const totalAmount = calculateTotalAmount(data.detail);
        onChange('ac_amt', totalAmount);
      }
    };

    const calculateTotalAmount = (details) => {
      if (details) {
        return details.reduce((total, detail) => {
          const amount = detail.qty * detail.rate;
          return total + amount;
        }, 0);
      }
      return 0;
    };
  
    // Function to generate a random 5-letter number
    const generateRandomVrNo = () => {
        const randomNumber = Math.floor(10000 + Math.random() * 90000);
        return randomNumber.toString().substring(0, 5);
    };

  return (
    <div className="header-section">
      <h3>Header</h3>
      <div className="header-inputs-top">
        <div className="header-inputs form-floating">
          <input
            type="text"
            className="form-control"
            id="voucherNumber"
            placeholder="Voucher Number"
            value={data.vr_no || randomVrNo}
            onChange={(e) => onChange('vr_no', e.target.value)}
            readOnly
          />
          <label htmlFor="voucherNumber">Voucher Number</label>
        </div>
        <div className="header-inputs form-floating">
          <input
            type="date"
            className="form-control"
            id="voucherDate"
            placeholder="Voucher Date"
            value={data.vr_date || new Date().toISOString().split('T')[0]}
            onChange={(e) => onChange('vr_date', e.target.value)}
          />
          <label htmlFor="voucherDate">Voucher Date</label>
        </div>
        <div className="header-inputs form-floating">
          {/* Dropdown for status */}
          <select
            className="form-select"
            id="status"
            value={data.status}
            onChange={(e) => onChange('status', e.target.value)}
          >
            <option value="A">Active</option>
            <option value="I">Inactive</option>
          </select>
          <label htmlFor="status">Status</label>
        </div>
      </div>
      <div className="header-inputs-bottom">
        <div className="header-inputs form-floating">
          <input
            type="text"
            className="form-control"
            id="accountName"
            placeholder="Account Name"
            value={data.ac_name}
            onChange={(e) => onChange('ac_name', e.target.value)}
            style={{ width: '20rem' }}
          />
          <label htmlFor="accountName">Account Name</label>
        </div>
        <div className="header-inputs form-floating">
          <input
            type="number"
            className="form-control"
            id="accountAmount"
            placeholder="Account Amount"
            value={data.ac_amt}
            readOnly
          />
          <label htmlFor="accountAmount">Account Amount</label>
        </div>
      </div>
    </div>
  );
};

export default HeaderSection;
