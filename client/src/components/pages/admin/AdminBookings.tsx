import React, { useEffect, useState } from 'react';
import { dashboardApi, BookingAdmin } from '../../../apis/dashboard';

interface Pagination {
  total: number;
  lastPage: number;
  currentPage: number;
  perPage: number;
  prev: number | null;
  next: number | null;
}

const truncateId = (id: string) => {
  return id.length > 12 ? `${id.substring(0, 12)}...` : id;
};

const tableStyles = {
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    marginBottom: '20px',
    backgroundColor: 'white',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  th: {
    padding: '12px 16px',
    backgroundColor: '#f8f9fa',
    borderBottom: '2px solid #dee2e6',
    textAlign: 'left' as const,
    fontSize: '14px',
    fontWeight: 600,
    color: '#495057',
  },
  td: {
    padding: '12px 16px',
    borderBottom: '1px solid #dee2e6',
    fontSize: '14px',
    color: '#212529',
  },
  statusCell: (status: string) => ({
    padding: '6px 12px',
    borderRadius: '4px',
    display: 'inline-block',
    fontWeight: 500,
    fontSize: '13px',
    backgroundColor: status === 'PAID' ? '#d4edda' : 
                    status === 'ONGOING' ? '#fff3cd' : 
                    status === 'CONFIRMED' ? '#cce5ff' : '#f8f9fa',
    color: status === 'PAID' ? '#155724' : 
           status === 'ONGOING' ? '#856404' : 
           status === 'CONFIRMED' ? '#004085' : '#383d41',
  }),
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    alignItems: 'center',
    marginTop: '20px',
  },
  button: {
    padding: '8px 16px',
    border: '1px solid #dee2e6',
    borderRadius: '4px',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    ':disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
  },
  actionButton: {
    padding: '6px 12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
    ':disabled': {
      backgroundColor: '#6c757d',
      cursor: 'not-allowed',
    },
  },
};

const BookingTable: React.FC = () => {
  const [bookings, setBookings] = useState<BookingAdmin[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    lastPage: 1,
    currentPage: 1,
    perPage: 10,
    prev: null as number | null,
    next: null as number | null,
  });
  const [loading, setLoading] = useState(false);
  const [returnLoading, setReturnLoading] = useState<string | null>(null);

  const fetchBookings = async (page = 1) => {
    setLoading(true);
    try {
      const res: any = await dashboardApi.getBookings({ page, perPage: pagination.perPage });
      if (res && Array.isArray(res.data)) {
        setBookings(res.data);
        setPagination({
          total: res.total,
          lastPage: res.lastPage,
          currentPage: res.currentPage,
          perPage: res.perPage,
          prev: res.prev,
          next: res.next,
        });
      } else {
        setBookings([]);
        setPagination({
          total: 0,
          lastPage: 1,
          currentPage: 1,
          perPage: 10,
          prev: null,
          next: null,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(1);
    // eslint-disable-next-line
  }, []);

  const handlePageChange = (page: number) => {
    fetchBookings(page);
  };

  const handleReturn = async (bookingId: string) => {
    try {
      setReturnLoading(bookingId);
      await dashboardApi.returnBooking(bookingId);
      // Refresh the bookings list
      await fetchBookings(pagination.currentPage);
    } catch (error) {
      console.error('Error returning booking:', error);
      alert('Failed to return the booking. Please try again.');
    } finally {
      setReturnLoading(null);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '24px', color: '#212529' }}>Danh sách đặt xe</h2>
      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <>
          <div style={{ overflowX: 'auto' }}>
            <table style={tableStyles.table}>
              <thead>
                <tr>
                  <th style={tableStyles.th}>Mã đơn</th>
                  <th style={tableStyles.th}>Ảnh xe</th>
                  <th style={tableStyles.th}>Ngày bắt đầu</th>
                  <th style={tableStyles.th}>Ngày trả</th>
                  <th style={tableStyles.th}>Giá</th>
                  <th style={tableStyles.th}>Trạng thái</th>
                  <th style={tableStyles.th}>Địa chỉ nhận</th>
                  <th style={tableStyles.th}>Địa chỉ trả</th>
                  <th style={tableStyles.th}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ ...tableStyles.td, textAlign: 'center' }}>
                      Không có dữ liệu
                    </td>
                  </tr>
                ) : (
                  bookings.map(b => (
                    <tr key={b.id}>
                      <td style={tableStyles.td}>{truncateId(b.code)}</td>
                      <td style={tableStyles.td}>
                        <img 
                          src={b.carImageUrl} 
                          alt="car" 
                          style={{ 
                            width: 60, 
                            height: 60, 
                            borderRadius: '6px',
                            objectFit: 'cover',
                          }} 
                        />
                      </td>
                      <td style={tableStyles.td}>
                        {new Date(b.startDate).toLocaleDateString('vi-VN')}
                      </td>
                      <td style={tableStyles.td}>
                        {new Date(b.endDate).toLocaleDateString('vi-VN')}
                      </td>
                      <td style={tableStyles.td}>
                        {b.totalPrice.toLocaleString('vi-VN')} VND
                      </td>
                      <td style={tableStyles.td}>
                        <span style={tableStyles.statusCell(b.status)}>
                          {b.status}
                        </span>
                      </td>
                      <td style={tableStyles.td}>{b.pickupAddress}</td>
                      <td style={tableStyles.td}>{b.returnAddress}</td>
                      <td style={tableStyles.td}>
                        <button
                          style={{
                            ...tableStyles.actionButton,
                            opacity: b.status !== 'ONGOING' ? 0.5 : 1,
                          }}
                          onClick={() => handleReturn(b.id)}
                          disabled={b.status !== 'ONGOING' || returnLoading === b.id}
                        >
                          {returnLoading === b.id ? 'Đang xử lý...' : 'Trả xe'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div style={tableStyles.pagination}>
            <button
              style={tableStyles.button}
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.prev}
            >
              Trước
            </button>
            <span style={{ fontSize: '14px' }}>
              Trang {pagination.currentPage} / {pagination.lastPage}
            </span>
            <button
              style={tableStyles.button}
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.next}
            >
              Tiếp
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BookingTable; 