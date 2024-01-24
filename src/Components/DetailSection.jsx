import React, { useState, useEffect } from 'react';

const DetailSection = ({ data, onChange, onAdd, onRemove, updateTotalAmount, totalAmount  }) => {
  const [itemList, setItemList] = useState([]);

  useEffect(() => {
    fetch('http://5.189.180.8:8010/item')
      .then((response) => response.json())
      .then((data) => {
        setItemList(data);
      })
      .catch((error) => console.error('Error fetching item list:', error));

  }, []);

  const calculateAmount = (qty, rate) => {
    if (qty!==undefined && rate!==undefined) {
        return qty * rate;
    } else return 0;
  };

  const getTotalAmount = () => {
    const totalAmount = data.reduce((total, detail) => {
      const amount = calculateAmount(detail.qty, detail.rate);
      return total + amount;
    }, 0);

    // Update the total amount in the parent component
    if (totalAmount !== updateTotalAmount) {
      updateTotalAmount(totalAmount);
    }

    return totalAmount;
  };

  const handleItemCodeChange = (index, value) => {
    // Find the corresponding item in the itemList
    const selectedItem = itemList.find((item) => item.item_code === value);

    if (selectedItem) {
      const itemName = selectedItem.item_name;

      // Update the state and Redux state for the specific row
      onChange(index, 'item_code', value);
      onChange(index, 'item_name', itemName);
      onChange(index, 'description', ''); // Reset description when item code changes
    }
  };

  const handleItemNameChange = (index, value) => {
    onChange(index, 'item_name', value);
  };

  return (
    <div className="detail-section">
      <h3>Details</h3>
      <table>
        <thead>
          <tr>
            <th>Sr no</th>
            <th>Item Code</th>
            <th>Item Name</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>Rate</th>
            <th>Amount</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((detail, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <select
                  value={detail.item_code || ''}
                  onChange={(e) => handleItemCodeChange(index, e.target.value)}
                >
                  <option value="">Select Item Code</option>
                  {itemList.map((item) => (
                    <option key={item.item_code} value={item.item_code}>
                      {item.item_code}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="text"
                  value={detail.item_name || ''}
                  readOnly
                />
              </td>
              <td>
                <input
                  type="text"
                  value={detail.description || ''}
                  onChange={(e) => onChange(index, 'description', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={detail.qty || ''}
                  onChange={(e) => onChange(index, 'qty', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={detail.rate || ''}
                  onChange={(e) => onChange(index, 'rate', e.target.value)}
                />
              </td>
              <td>{calculateAmount(detail.qty, detail.rate)}</td>
              <td>
                <button onClick={() => onRemove(index)}>Remove</button>
              </td>
            </tr>
          ))}
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td><b>Total:</b></td>
            <td><b>{getTotalAmount()}</b></td>
            <td>
                <button onClick={onAdd} className="button">
                    Add Detail
                </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DetailSection;
