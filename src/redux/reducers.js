const initialState = {
    salesData: {
      header: {
        vr_no: 0,
        vr_date: '',
        ac_name: '',
        ac_amt: 0,
        status: '',
      },
      detail: [],
      totalAmount: 0,
    },
  };
  
  const salesReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SAVE_SALES_DATA':
        return {
          ...state,
          salesData: {
            ...state.salesData,
            header: action.payload.header,
            detail: action.payload.detail,
            totalAmount: action.payload.totalAmount,
          },
        };
  
      default:
        return state;
    }
  };
  
  export default salesReducer;