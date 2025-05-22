import React from 'react';
import CustomePaginate from '../../paginations/CustomePaginate';
const AdminCars: React.FC = () => {
    return (
        <div style={{padding: 32}}>
            <CustomePaginate isAdmin />
        </div>
    );
}

export default AdminCars; 