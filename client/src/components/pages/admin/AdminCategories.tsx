import React, { useState, useEffect } from 'react';
import styles from './AdminCategories.module.css';
import { categoryApi } from '../../../apis/category';
import type { Category, CreateCategoryInput, UpdateCategoryInput } from '../../../types/category'; // Ensure UpdateCategoryInput is imported

const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for adding a new category
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');

  // State for editing an existing category
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [editCategoryDescription, setEditCategoryDescription] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedCategories = await categoryApi.getAll();
      setCategories(fetchedCategories);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh mục.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      alert('Tên danh mục không được để trống.');
      return;
    }
    const newCategoryInput: CreateCategoryInput = {
      name: newCategoryName.trim(),
      description: newCategoryDescription.trim() || undefined,
    };

    try {
      setIsSubmitting(true);
      setError(null);
      const createdCategory = await categoryApi.create(newCategoryInput);
      setCategories(prevCategories => [...prevCategories, createdCategory]);
      setNewCategoryName('');
      setNewCategoryDescription('');
    } catch (err: any) {
      setError(err.message || 'Không thể thêm danh mục.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setEditCategoryName(category.name);
    setEditCategoryDescription(category.description || '');
    setError(null); // Clear previous errors
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditCategoryName('');
    setEditCategoryDescription('');
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !editCategoryName.trim()) {
      alert('Tên danh mục không được để trống khi cập nhật.');
      return;
    }

    const updateInput: UpdateCategoryInput = {
      name: editCategoryName.trim(),
      description: editCategoryDescription.trim() || undefined,
    };

    try {
      setIsSubmitting(true);
      setError(null);
      const updatedCategory = await categoryApi.update(editingCategory.id, updateInput);
      setCategories(prevCategories =>
        prevCategories.map(cat => (cat.id === updatedCategory.id ? updatedCategory : cat))
      );
      handleCancelEdit(); // Close edit form
    } catch (err: any) {
      setError(err.message || 'Không thể cập nhật danh mục.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      return;
    }
    try {
      setIsSubmitting(true);
      setError(null);
      await categoryApi.deleteCategory(categoryId);
      setCategories(prevCategories => prevCategories.filter(cat => cat.id !== categoryId));
    } catch (err: any) {
      setError(err.message || 'Không thể xóa danh mục.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className={styles.adminCategoriesContainer}><p>Đang tải danh mục...</p></div>;
  }

  return (
    <div className={styles.adminCategoriesContainer}>
      <h2>Quản Lý Danh Mục</h2>
      {error && <div className={`${styles.errorBanner} ${styles.errorState}`}><p>{error}</p></div>}

      {/* Edit Category Form - Modal or Inline */}
      {editingCategory && (
        <div className={`${styles.editCategoryForm} ${styles.formCard}`}>
          <h3>Chỉnh Sửa Danh Mục: {editingCategory.name}</h3>
          <input
            type="text"
            placeholder="Tên danh mục"
            value={editCategoryName}
            onChange={(e) => setEditCategoryName(e.target.value)}
            className={styles.inputField}
            disabled={isSubmitting}
          />
          <textarea
            placeholder="Mô tả (tùy chọn)"
            value={editCategoryDescription}
            onChange={(e) => setEditCategoryDescription(e.target.value)}
            className={styles.textareaField}
            disabled={isSubmitting}
          />
          <div className={styles.formActions}>
            <button onClick={handleUpdateCategory} className={`${styles.actionButton} ${styles.saveButton}`} disabled={isSubmitting || !editCategoryName.trim()}>
              {isSubmitting ? 'Đang lưu...' : 'Lưu Thay Đổi'}
            </button>
            <button onClick={handleCancelEdit} className={`${styles.actionButton} ${styles.cancelButton}`} disabled={isSubmitting}>
              Hủy
            </button>
          </div>
        </div>
      )}

      {/* Add Category Form */}
      {!editingCategory && (
         <div className={`${styles.addCategoryForm} ${styles.formCard}`}>
          <h3>Thêm Danh Mục Mới</h3>
          <input
            type="text"
            placeholder="Tên danh mục"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className={styles.inputField}
            disabled={isSubmitting}
          />
          <textarea
            placeholder="Mô tả (tùy chọn)"
            value={newCategoryDescription}
            onChange={(e) => setNewCategoryDescription(e.target.value)}
            className={styles.textareaField}
            disabled={isSubmitting}
          />
          <button onClick={handleAddCategory} className={`${styles.actionButton} ${styles.addButton}`} disabled={isSubmitting || !newCategoryName.trim()}>
            {isSubmitting ? 'Đang thêm...' : 'Thêm Danh Mục'}
          </button>
        </div>
      )}

      <div className={styles.categoryList}>
        <h3>Danh Sách Danh Mục</h3>
        {categories.length === 0 && !isLoading ? (
          <p>Chưa có danh mục nào.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>{/* Added ID column header */}
                <th>Tên Danh Mục</th>
                <th>Mô Tả</th>
                {/* <th>Hành Động</th> */}
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.id}</td>{/* Added ID data cell */}
                  <td>{category.name}</td>
                  <td>{category.description || '-'}</td>
                  {/* <td>
                    <button 
                      onClick={() => handleEditCategory(category)} 
                      className={`${styles.actionButton} ${styles.editButton}`}
                      disabled={isSubmitting || !!editingCategory} // Disable if another edit is in progress
                    >
                      Sửa
                    </button>
                    <button 
                      onClick={() => handleDeleteCategory(category.id)} 
                      className={`${styles.actionButton} ${styles.deleteButton}`}
                      disabled={isSubmitting || !!editingCategory} // Disable if an edit is in progress
                    >
                      {isSubmitting && !editingCategory ? 'Đang xóa...' : 'Xóa'} 
                    </button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminCategories;
