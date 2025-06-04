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

  const fetchBookings = async (page = 1) => {
    setLoading(true);
    try {
      const res: any = await dashboardApi.getBookings({ page, perPage: pagination.perPage });
      if (Array.isArray(res)) {
        setBookings(res);
        setPagination({
          total: res.length,
          lastPage: 1,
          currentPage: 1,
          perPage: res.length,
          prev: null,
          next: null,
        });
      } else if (res && res.data && Array.isArray(res.data.data)) {
        setBookings(res.data.data || []);
        setPagination({
          total: res.data.total,
          lastPage: res.data.lastPage,
          currentPage: res.data.currentPage,
          perPage: res.data.perPage,
          prev: res.data.prev,
          next: res.data.next,
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

  return (
    <div>
      <h2>Danh sách đặt xe</h2>
      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 16 }}>
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Ảnh xe</th>
                <th>Ngày bắt đầu</th>
                <th>Ngày trả</th>
                <th>Giá</th>
                <th>Trạng thái</th>
                <th>Địa chỉ nhận</th>
                <th>Địa chỉ trả</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center' }}>Không có dữ liệu</td>
                </tr>
              ) : (
                bookings.map(b => (
                  <tr key={b.id}>
                    <td>{b.code}</td>
                    <td>
                      <img src={b.carImageUrl} alt="car" style={{ width: 60, borderRadius: 6 }} />
                    </td>
                    <td>{new Date(b.startDate).toLocaleDateString('vi-VN')}</td>
                    <td>{new Date(b.endDate).toLocaleDateString('vi-VN')}</td>
                    <td>{b.totalPrice.toLocaleString('vi-VN')} VND</td>
                    <td>{b.status}</td>
                    <td>{b.pickupAddress}</td>
                    <td>{b.returnAddress}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.prev}
            >
              Trước
            </button>
            <span>
              Trang {pagination.currentPage} / {pagination.lastPage}
            </span>
            <button
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