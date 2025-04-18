import { AdminRoute } from 'components/utils/AdminRoute';
import { PublicLayout } from 'layout/PublicLayout';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { getUsers, deleteUser, getProducts, createProduct, updateProduct, deleteProduct, getOrders, updateOrderStatus, getDashboardStats, getRecentActivity, getUserOrders, getCategories, getBrands } from 'services/adminService';
import { useAuth } from 'context/AuthContext';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users,
  Plus,
  RefreshCw,
  Search,
  Edit,
  Trash2,
  AlertTriangle,
  X,
  Filter,
  FilterX,
  AlertCircle,
  CheckCircle,
  Clock,
  Loader,
  XCircle,
  CheckSquare,
  ShoppingBag,
  User,
  TrendingUp,
  DollarSign,
  Edit2,
  Tag
} from 'lucide-react';
import UserOrdersModal from 'components/Admin/UserOrdersModal';
import DeleteConfirmPopup from 'components/Admin/DeleteConfirmPopup';
import ProductForm from 'components/Admin/ProductForm';
import CategoryBrandManager from 'components/Admin/CategoryBrandManager';
import { OrderDetails } from 'components/Admin/OrderDetails';

const breadcrumbsData = [
  {
    label: 'Home',
    path: '/',
  },
  {
    label: 'Admin Dashboard',
    path: '/admin',
  },
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { user: currentUser } = useAuth();
  
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    oldPrice: '',
    category: '',
    brand: '',
    description: '',
    content: '',
    isNew: false,
    isSale: false,
    isStocked: true,
    image: '',
    imageGallery: [''],
    filterItems: [],
    colors: [],
    productNumber: ''
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderStatusLoading, setOrderStatusLoading] = useState(false);
  
  const [dashboardStats, setDashboardStats] = useState({
    users: { total: 0 },
    products: { total: 0 },
    orders: { total: 0, pending: 0, completed: 0, cancelled: 0 },
    revenue: { total: 0 }
  });
  const [dashboardActivity, setDashboardActivity] = useState({
    recentOrders: [],
    activities: []
  });
  const [dashboardLoading, setDashboardLoading] = useState(false);
  
  const [showUserOrdersModal, setShowUserOrdersModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [userOrdersLoading, setUserOrdersLoading] = useState(false);
  
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  
  const [showProductForm, setShowProductForm] = useState(false);
  const [productActionLoading, setProductActionLoading] = useState(false);
  
  const [statusFilter, setStatusFilter] = useState('');
  
  const [showCategoryBrandManager, setShowCategoryBrandManager] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  
  const productCategories = [...new Set(products.map(product => product.category))];
  const productBrands = [...new Set(products.map(product => product.brand))];
  
  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'products') {
      fetchProducts();
    } else if (activeTab === 'orders') {
      fetchOrders();
    } else if (activeTab === 'dashboard') {
      fetchDashboardData();
    }
  }, [activeTab]);
  
  useEffect(() => {
    // Initial data loading
    const loadInitialData = async () => {
      try {
        const userData = await getUsers();
        setUsers(userData);
        
        const productData = await getProducts();
        setProducts(productData);
      } catch (err) {
        console.error('Error loading initial data:', err);
      }
    };
    
    loadInitialData();
  }, []);
  
  useEffect(() => {
    const loadCategoriesAndBrands = async () => {
      try {
        const [categoriesData, brandsData] = await Promise.all([
          getCategories(),
          getBrands()
        ]);
        
        setCategories(categoriesData);
        setBrands(brandsData);
      } catch (err) {
        console.error('Error loading categories and brands:', err);
      }
    };
    
    loadCategoriesAndBrands();
  }, []);
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError('Failed to load users. Please try again.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError('Failed to load products. Please try again.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchDashboardData = async () => {
    try {
      setDashboardLoading(true);
      setError(null);
      
      console.log('Fetching dashboard stats...');
      const statsData = await getDashboardStats();
      console.log('Received stats:', statsData);
      setDashboardStats(statsData);
      
      console.log('Fetching recent activity...');
      const activityData = await getRecentActivity();
      console.log('Received activity:', activityData);
      setDashboardActivity(activityData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      console.error('Error details:', err.response?.data);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setDashboardLoading(false);
    }
  };
  
  const handleDeleteProduct = (productId, productName) => {
    setItemToDelete({
      id: productId,
      name: productName,
      type: 'product'
    });
    setShowDeletePopup(true);
  };
  
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    
    try {
      setProductActionLoading(true);
      setError(null);
      setSuccess(null);
      
      if (itemToDelete.type === 'product') {
        await deleteProduct(itemToDelete.id);
        setProducts(prev => prev.filter(product => product.id !== itemToDelete.id));
        setSuccess('Product deleted successfully');
      }
    } catch (err) {
      setError('Failed to delete. Please try again.');
      console.error('Error deleting:', err);
    } finally {
      setProductActionLoading(false);
      setShowDeletePopup(false);
      setItemToDelete(null);
    }
  };
  
  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowProductForm(true);
  };
  
  const handleAddProduct = () => {
    setSelectedProduct(null);
    setShowProductForm(true);
  };
  
  const handleProductSubmit = async (formData) => {
    try {
      setProductActionLoading(true);
      setError(null);
      setSuccess(null);
      
      // Filter out empty gallery images
      const cleanedFormData = {
        ...formData,
        imageGallery: formData.imageGallery.filter(url => url && url.trim() !== '')
      };

      // Find the category and brand objects by their slugs
      const selectedCategory = categories.find(cat => cat.slug === formData.category);
      const selectedBrand = brands.find(brand => brand.slug === formData.brand);
      
      // Convert price and oldPrice to numbers and validate
      const price = parseFloat(cleanedFormData.price);
      const oldPrice = cleanedFormData.oldPrice ? parseFloat(cleanedFormData.oldPrice) : null;

      if (isNaN(price)) {
        setError('Please enter a valid price');
        return;
      }

      if (cleanedFormData.oldPrice && isNaN(oldPrice)) {
        setError('Please enter a valid old price');
        return;
      }
      
      // Prepare product data with proper types
      const productData = {
        ...cleanedFormData,
        categoryId: selectedCategory?.id || null,
        brandId: selectedBrand?.id || null,
        price: price,
        oldPrice: oldPrice,
        category: selectedCategory?.name || cleanedFormData.category || '',
        brand: selectedBrand?.name || cleanedFormData.brand || '',
        isNew: Boolean(cleanedFormData.isNew),
        isSale: Boolean(cleanedFormData.isSale),
        isStocked: Boolean(cleanedFormData.isStocked),
        colors: Array.isArray(cleanedFormData.colors) ? cleanedFormData.colors : [],
        filterItems: Array.isArray(cleanedFormData.filterItems) ? cleanedFormData.filterItems : []
      };

      console.log('Submitting product data:', productData);
      
      if (selectedProduct) {
        const updatedProduct = await updateProduct(selectedProduct.id, productData);
        setProducts(prev => 
          prev.map(product => 
            product.id === selectedProduct.id ? updatedProduct : product
          )
        );
        setSuccess('Product updated successfully');
      } else {
        const newProduct = await createProduct(productData);
        setProducts(prev => [newProduct, ...prev]);
        setSuccess('Product added successfully');
      }
      
      setShowProductForm(false);
    } catch (err) {
      console.error('Error saving product:', err);
      setError(err.response?.data?.message || 'Failed to save product. Please try again.');
    } finally {
      setProductActionLoading(false);
    }
  };
  
  // Format date to a more readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Format price to currency
  const formatPrice = (price) => {
    return parseFloat(price).toFixed(2);
  };
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || product.category === categoryFilter;
    const matchesBrand = !brandFilter || product.brand === brandFilter;
    
    return matchesSearch && matchesCategory && matchesBrand;
  });
  
  // Add this after the filteredProducts definition
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (order.user?.name && order.user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (order.user?.email && order.user.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = !statusFilter || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Get current products for pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  
  // Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Smooth scroll to top of products grid
    document.querySelector('.products-grid-container')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  
  // Reset currentPage when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, brandFilter]);
  
  // Add these handler functions
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleCategoryFilterChange = (e) => {
    setCategoryFilter(e.target.value);
  };
  
  const handleBrandFilterChange = (e) => {
    setBrandFilter(e.target.value);
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setBrandFilter('');
  };
  
  // Handle order status update
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setOrderStatusLoading(true);
      const updatedOrder = await updateOrderStatus(orderId, newStatus);
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? updatedOrder : order
        )
      );
      setSuccess('Order status updated successfully');
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('Failed to update order status');
    } finally {
      setOrderStatusLoading(false);
    }
  };
  
  // Add this calculation before the renderContent function
  const calculateTotalRevenue = () => {
    if (!orders || orders.length === 0) return 0;
    return orders.reduce((total, order) => {
      // Only count completed orders in revenue
      if (order.status === 'COMPLETED') {
        return total + Number(order.totalAmount);
      }
      return total;
    }, 0);
  };
  
  // Add this useEffect to handle the navigation event
  useEffect(() => {
    const handleOrderNavigation = (event) => {
      const { orderId } = event.detail;
      setActiveTab('orders');
      // Optionally: add logic to highlight the specific order
    };
    
    window.addEventListener('navigateToOrder', handleOrderNavigation);
    
    return () => {
      window.removeEventListener('navigateToOrder', handleOrderNavigation);
    };
  }, []);
  
  // Add this computed property for filtered users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });
  
  // Add these functions for user management that were previously duplicated
  const viewUserOrders = async (userId) => {
    try {
      setUserOrdersLoading(true);
      const user = users.find(u => u.id === userId);
      setSelectedUser(user);
      
      const orders = await getUserOrders(userId);
      setUserOrders(orders);
      setShowUserOrdersModal(true);
    } catch (error) {
      console.error('Error fetching user orders:', error);
      setError('Failed to fetch user orders');
    } finally {
      setUserOrdersLoading(false);
    }
  };
  
  const handleDeleteUser = (userId, userName) => {
    setItemToDelete({
      id: userId,
      name: userName,
      type: 'user'
    });
    setShowDeletePopup(true);
  };
  
  const handleConfirmDeleteUser = () => {
    if (!itemToDelete) return;
    
    if (itemToDelete.type === 'user') {
      deleteUserNow(itemToDelete.id);
    }
    
    setShowDeletePopup(false);
    setItemToDelete(null);
  };
  
  // Add this new function to handle the actual deletion
  const deleteUserNow = async (userId) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      await deleteUser(userId);
      
      // Remove the deleted user from local state
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      
      setSuccess('User deleted successfully');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete user';
      setError(errorMessage);
      console.error('Error deleting user:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Add this function to highlight user orders when navigating from the user management section
  const highlightUserOrders = (userId) => {
    setActiveTab('orders');
    // You could set a filter state to only show this user's orders
    setSearchTerm(users.find(u => u.id === userId)?.name || '');
  };
  
  const handleCategoriesUpdate = (updatedCategories) => {
    setCategories(updatedCategories);
  };
  
  const handleBrandsUpdate = (updatedBrands) => {
    setBrands(updatedBrands);
  };
  
  const handleToggleProductFlag = async (productId, flag, value) => {
    try {
      setProductActionLoading(true);
      const updatedProduct = await updateProduct(productId, { [flag]: value });
      
      // Update the products list
      setProducts(prevProducts => 
        prevProducts.map(p => p.id === productId ? {...p, [flag]: value} : p)
      );
      
      setSuccess(`Product ${flag === 'isNew' ? (value ? 'marked as new' : 'removed from new arrivals') : 'updated'}`);
    } catch (error) {
      setError('Failed to update product');
      console.error(`Error updating product ${flag}:`, error);
    } finally {
      setProductActionLoading(false);
    }
  };
  
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="admin-dashboard-content">
            <h2>Dashboard Overview</h2>
            
            {error && <div className="admin-alert error">{error}</div>}
            
            {dashboardLoading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading dashboard data...</p>
              </div>
            ) : (
              <>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">
                      <ShoppingCart size={32} />
                    </div>
                    <h3>Total Orders</h3>
                    <div className="stat-value">{dashboardStats.orders.total}</div>
                    <p className="stat-period">
                      <TrendingUp size={14} /> All time
                    </p>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-icon">
                      <Users size={32} />
                    </div>
                    <h3>Total Users</h3>
                    <div className="stat-value">{dashboardStats.users.total}</div>
                    <p className="stat-period">
                      <TrendingUp size={14} /> All time
                    </p>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-icon">
                      <DollarSign size={32} />
                    </div>
                    <h3>Revenue</h3>
                    <div className="stat-value">${dashboardStats.revenue.total.toFixed(2)}</div>
                    <p className="stat-period">
                      <TrendingUp size={14} /> From completed orders
                    </p>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-icon">
                      <Package size={32} />
                    </div>
                    <h3>Products</h3>
                    <div className="stat-value">{dashboardStats.products.total}</div>
                    <p className="stat-period">
                      <TrendingUp size={14} /> Active products
                    </p>
                  </div>
                </div>
                
                <div className="dashboard-main-content">
                  <div className="latest-orders">
                    <h3>Recent Orders</h3>
                    
                    {dashboardActivity.recentOrders.length === 0 ? (
                      <div className="no-orders-message">
                        <p>No orders found in the system.</p>
                      </div>
                    ) : (
                      <div className="latest-orders-list">
                        {dashboardActivity.recentOrders.map(order => (
                          <div key={order.id} className="order-preview">
                            <div className="order-preview-info">
                              <h4>#{order.orderNumber}</h4>
                              <p>
                                {new Date(order.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                                {' • '}
                                {order.user?.name || 'Customer'}
                              </p>
                            </div>
                            <div className="order-preview-right">
                              <span className="order-preview-amount">
                                ${order.totalAmount.toFixed(2)}
                              </span>
                              <span className={`order-preview-status ${order.status.toLowerCase()}`}>
                                {order.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('orders'); }} className="view-all-link">
                      View all orders →
                    </a>
                  </div>
                  
                  <div className="recent-activity">
                    <h3>Recent Activity</h3>
                    <div className="activity-list">
                      {dashboardActivity.activities.map((activity, index) => {
                        let icon, title, content;
                        
                        // Format the date
                        const formattedDate = new Date(activity.date).toLocaleString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        });
                        
                        // Set icon and content based on activity type
                        if (activity.type === 'order') {
                          icon = <ShoppingBag size={12} />;
                          
                          if (activity.status === 'COMPLETED') {
                            title = `Order ${activity.orderNumber} was completed`;
                            content = `${activity.userName} • $${activity.amount.toFixed(2)}`;
                          } else if (activity.status === 'CANCELLED') {
                            title = `Order ${activity.orderNumber} was cancelled`;
                            content = activity.userName;
                          } else {
                            title = `New order placed: ${activity.orderNumber}`;
                            content = `${activity.userName} • $${activity.amount.toFixed(2)}`;
                          }
                        } else if (activity.type === 'user') {
                          icon = <User size={12} />;
                          title = 'New user registered';
                          content = activity.name;
                        } else if (activity.type === 'product') {
                          icon = <Package size={12} />;
                          title = 'New product added';
                          content = activity.name;
                        }
                        
                        return (
                          <div key={`${activity.type}-${activity.id}-${index}`} className="activity-item">
                            <div className="activity-icon">
                              {icon}
                            </div>
                            <div className="activity-content">
                              <div className="activity-time">{formattedDate}</div>
                              <p>{title}: <strong>{content}</strong></p>
                            </div>
                          </div>
                        );
                      })}
                      
                      {dashboardActivity.activities.length === 0 && (
                        <div className="no-activity">
                          <p>No recent activity to display.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="sales-chart">
                  <h3>Orders by Status</h3>
                  <div className="chart-container">
                    <div className="status-chart">
                      <div className="status-bar-container">
                        <div className="status-label">Pending</div>
                        <div className="status-bar-wrapper">
                          <div 
                            className="status-bar pending"
                            style={{
                              width: `${dashboardStats.orders.total ? (dashboardStats.orders.pending / dashboardStats.orders.total * 100) : 0}%`
                            }}
                          >
                            {dashboardStats.orders.pending}
                          </div>
                        </div>
                      </div>
                      
                      <div className="status-bar-container">
                        <div className="status-label">Completed</div>
                        <div className="status-bar-wrapper">
                          <div 
                            className="status-bar completed"
                            style={{
                              width: `${dashboardStats.orders.total ? (dashboardStats.orders.completed / dashboardStats.orders.total * 100) : 0}%`
                            }}
                          >
                            {dashboardStats.orders.completed}
                          </div>
                        </div>
                      </div>
                      
                      <div className="status-bar-container">
                        <div className="status-label">Cancelled</div>
                        <div className="status-bar-wrapper">
                          <div 
                            className="status-bar cancelled"
                            style={{
                              width: `${dashboardStats.orders.total ? (dashboardStats.orders.cancelled / dashboardStats.orders.total * 100) : 0}%`
                            }}
                          >
                            {dashboardStats.orders.cancelled}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        );
      case 'products':
        return (
          <div className="admin-products">
            <div className="admin-section-header">
              <div className="header-left">
                <h2>Products Management</h2>
                <p className="subtitle">Manage your product inventory</p>
              </div>
              <div className="header-actions">
                <div className="search-box">
                  <Search size={18} />
                  <input 
                    type="text" 
                    placeholder="Search products..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button 
                  className="manage-btn" 
                  onClick={() => setShowCategoryBrandManager(true)}
                >
                  <Tag size={18} />
                  <span>Manage Categories & Brands</span>
                </button>
                <button 
                  className="refresh-btn" 
                  onClick={fetchProducts}
                  disabled={loading}
                >
                  <RefreshCw size={18} className={loading ? 'spin' : ''} />
                  <span>Refresh</span>
                </button>
                <button 
                  className="add-btn" 
                  onClick={handleAddProduct}
                >
                  <Plus size={18} />
                  <span>Add Product</span>
                </button>
              </div>
            </div>
            
            {error && <div className="admin-alert error">{error}</div>}
            {success && <div className="admin-alert success">{success}</div>}
            
            <div className="products-filters">
              <div className="filter-select">
                <select 
                  value={categoryFilter} 
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="filter-select">
                <select 
                  value={brandFilter} 
                  onChange={(e) => setBrandFilter(e.target.value)}
                >
                  <option value="">All Brands</option>
                  {brands.map(brand => (
                    <option key={brand.id} value={brand.slug}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <button 
                className="filter-btn" 
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('');
                  setBrandFilter('');
                }}
              >
                <FilterX size={18} />
                Clear Filters
              </button>
            </div>
            
            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading products...</p>
              </div>
            ) : (
              <>
                {filteredProducts.length === 0 ? (
                  <div className="empty-state">
                    <Package size={48} />
                    <h3>No Products Found</h3>
                    <p>{products.length === 0 
                      ? "There are no products yet. Click 'Add Product' to create one." 
                      : "No products match your search criteria."}</p>
                    {(searchTerm || categoryFilter || brandFilter) && (
                      <button className="clear-search" onClick={() => {
                        setSearchTerm('');
                        setCategoryFilter('');
                        setBrandFilter('');
                      }}>
                        Clear Filters
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="products-grid-container">
                    <div className="products-grid">
                      {filteredProducts.map(product => (
                        <div key={product.id} className="product-card">
                          <div className="product-card-inner">
                            <div className="product-card-front">
                              <div className="product-image">
                                <img src={product.image} alt={product.name} />
                                {product.isNew && <span className="product-tag new">New</span>}
                                {product.isSale && <span className="product-tag sale">Sale</span>}
                              </div>
                              <div className="product-info">
                                <h3 className="product-name">{product.name}</h3>
                                <div className="product-meta">
                                  <span className="product-brand">{product.brand}</span>
                                  <span className="product-price">${product.price}</span>
                                </div>
                                <div className="product-controls">
                                  <button 
                                    className="product-btn edit" 
                                    onClick={() => handleEditProduct(product)}
                                  >
                                    <Edit2 size={14} />
                                    Edit
                                  </button>
                                  <button 
                                    className="product-btn delete" 
                                    onClick={() => handleDeleteProduct(product.id, product.name)}
                                  >
                                    <Trash2 size={14} />
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className="product-card-actions">
                              <div className="product-flags">
                                <button 
                                  onClick={() => handleToggleProductFlag(product.id, 'isNew', !product.isNew)}
                                  className={`flag-btn ${product.isNew ? 'active' : ''}`}
                                >
                                  {product.isNew ? 'Remove New Tag' : 'Mark as New'}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
            
            {/* Product Form Modal */}
            {showProductForm && (
              <div className="modal-overlay" onClick={() => !productActionLoading && setShowProductForm(false)}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                  <button 
                    className="modal-close-btn" 
                    onClick={() => !productActionLoading && setShowProductForm(false)}
                    disabled={productActionLoading}
                  >
                    <X size={24} />
                  </button>
                  <ProductForm 
                    product={selectedProduct}
                    onSubmit={handleProductSubmit}
                    onCancel={() => setShowProductForm(false)}
                    isLoading={productActionLoading}
                    categoryList={categories}
                    brandList={brands}
                  />
                </div>
              </div>
            )}
          </div>
        );
      case 'orders':
        return (
          <div className="admin-orders">
            <div className="admin-section-header">
              <div className="header-left">
                <h2>Orders Management</h2>
                <p className="subtitle">Track and process customer orders</p>
              </div>
              <div className="enhanced-search">
                <div className="search-wrapper">
                  <Search size={18} className="search-icon" />
                  <input 
                    type="text" 
                    placeholder="Search by order #, customer name..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button 
                      className="clear-input" 
                      onClick={() => setSearchTerm('')}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                <button 
                  className="refresh-btn" 
                  onClick={fetchOrders}
                  disabled={loading}
                >
                  <RefreshCw size={16} className={loading ? 'spin' : ''} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {error && <div className="admin-alert error">{error}</div>}
            {success && <div className="admin-alert success">{success}</div>}

            <div className="status-filters">
              <button 
                className={`status-filter ${!statusFilter ? 'active' : ''}`} 
                onClick={() => setStatusFilter('')}
              >
                <span className="filter-badge all">{orders.length}</span>
                All Orders
              </button>
              <button 
                className={`status-filter ${statusFilter === 'PENDING' ? 'active' : ''}`} 
                onClick={() => setStatusFilter('PENDING')}
              >
                <span className="filter-badge pending">{orders.filter(o => o.status === 'PENDING').length}</span>
                Pending
              </button>
              <button 
                className={`status-filter ${statusFilter === 'COMPLETED' ? 'active' : ''}`} 
                onClick={() => setStatusFilter('COMPLETED')}
              >
                <span className="filter-badge completed">{orders.filter(o => o.status === 'COMPLETED').length}</span>
                Completed
              </button>
              <button 
                className={`status-filter ${statusFilter === 'CANCELLED' ? 'active' : ''}`} 
                onClick={() => setStatusFilter('CANCELLED')}
              >
                <span className="filter-badge cancelled">{orders.filter(o => o.status === 'CANCELLED').length}</span>
                Cancelled
              </button>
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading orders...</p>
              </div>
            ) : (
              <>
                {filteredOrders.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">
                      <ShoppingBag size={48} />
                    </div>
                    <h3>No Orders Found</h3>
                    <p>{orders.length === 0 
                      ? "There are no orders to display at the moment." 
                      : "No orders match your search criteria."}</p>
                    {(searchTerm || statusFilter) && (
                      <button className="reset-filters" onClick={() => {
                        setSearchTerm('');
                        setStatusFilter('');
                      }}>
                        <FilterX size={16} />
                        Reset Filters
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="order-cards">
                    {filteredOrders.map(order => {
                      const items = typeof order.items === 'string' 
                        ? JSON.parse(order.items) 
                        : order.items;

                      return (
                        <div key={order.id} className={`order-card ${order.status.toLowerCase()}`}>
                          <div className="order-card-header">
                            <div className="order-id-section">
                              <span className="order-label">Order ID</span>
                              <h3 className="order-id">#{order.orderNumber}</h3>
                            </div>
                            <div className="order-status-section">
                              <span className="order-label">Status</span>
                              <div className={`order-status ${order.status.toLowerCase()}`}>
                                {order.status === 'PENDING' && <Clock size={14} />}
                                {order.status === 'COMPLETED' && <CheckCircle size={14} />}
                                {order.status === 'CANCELLED' && <XCircle size={14} />}
                                {order.status}
                              </div>
                            </div>
                          </div>
                          
                          <div className="order-card-body">
                            <div className="order-info-grid">
                              <div className="order-info-item">
                                <span className="info-label">Customer</span>
                                <div className="info-value customer">
                                  <User size={14} />
                                  {order.user?.name || 'N/A'}
                                </div>
                              </div>
                              
                              <div className="order-info-item">
                                <span className="info-label">Date</span>
                                <div className="info-value">
                                  <Clock size={14} />
                                  {formatDate(order.createdAt)}
                                </div>
                              </div>
                              
                              <div className="order-info-item">
                                <span className="info-label">Items</span>
                                <div className="info-value">
                                  <Package size={14} />
                                  {items.length} {items.length === 1 ? 'item' : 'items'}
                                </div>
                              </div>
                              
                              <div className="order-info-item">
                                <span className="info-label">Total</span>
                                <div className="info-value total">
                                  <DollarSign size={14} />
                                  ${order.totalAmount.toFixed(2)}
                                </div>
                              </div>
                            </div>
                            
                            <div className="order-items-preview">
                              {items.slice(0, 3).map((item, i) => (
                                <div key={i} className="item-preview">
                                  <span className="item-name">{item.name}</span>
                                  <span className="item-quantity">x{item.quantity || 1}</span>
                                </div>
                              ))}
                              {items.length > 3 && (
                                <div className="more-items">
                                  +{items.length - 3} more items
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {order.status === 'PENDING' && (
                            <div className="order-actions">
                              <button
                                className="action-button complete"
                                onClick={() => handleStatusUpdate(order.id, 'COMPLETED')}
                                disabled={orderStatusLoading}
                              >
                                <CheckCircle size={16} />
                                Mark as Completed
                              </button>
                              <button
                                className="action-button cancel"
                                onClick={() => handleStatusUpdate(order.id, 'CANCELLED')}
                                disabled={orderStatusLoading}
                              >
                                <XCircle size={16} />
                                Cancel Order
                              </button>
                            </div>
                          )}

                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: '16px',
                            padding: '12px',
                            backgroundColor: '#f8fafc',
                            borderRadius: '8px'
                          }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}>
                              {order.paymentProof && (
                                <div style={{
                                  width: '40px',
                                  height: '40px',
                                  borderRadius: '4px',
                                  overflow: 'hidden',
                                  border: '1px solid #eee'
                                }}>
                                  <img
                                    src={`${process.env.NEXT_PUBLIC_API_URL}${order.paymentProof}`}
                                    alt="Payment Proof"
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'cover'
                                    }}
                                  />
                                </div>
                              )}
                              <span style={{
                                fontSize: '14px',
                                color: order.paymentProof ? '#16a34a' : '#dc2626'
                              }}>
                                {order.paymentProof ? 'Payment Proof Uploaded' : 'No Payment Proof'}
                              </span>
                            </div>

                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowOrderDetails(true);
                              }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px 16px',
                                backgroundColor: '#4a7bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '500',
                                transition: 'all 0.2s'
                              }}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                              </svg>
                              View Details
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        );
      case 'users':
        return (
          <div className="admin-users">
            <div className="admin-section-header">
              <div className="header-left">
                <h2>Users Management</h2>
                <p className="subtitle">Manage registered users and their accounts</p>
              </div>
              <div className="header-actions">
                <div className="search-box">
                  <Search size={18} />
                  <input 
                    type="text" 
                    placeholder="Search by name or email..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button 
                  className="refresh-btn" 
                  onClick={fetchUsers}
                  disabled={loading}
                >
                  <RefreshCw size={18} className={loading ? 'spin' : ''} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {error && <div className="admin-alert error">{error}</div>}
            {success && <div className="admin-alert success">{success}</div>}

            <div className="users-stats">
              <div className="stat-card">
                <div className="stat-icon">
                  <Users size={24} />
                </div>
                <div className="stat-info">
                  <span className="stat-label">Total Users</span>
                  <h4>{users.length}</h4>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <ShoppingBag size={24} />
                </div>
                <div className="stat-info">
                  <span className="stat-label">Users with Orders</span>
                  <h4>{users.filter(user => user.orderCount > 0).length}</h4>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <Clock size={24} />
                </div>
                <div className="stat-info">
                  <span className="stat-label">New This Month</span>
                  <h4>{users.filter(user => {
                    const userDate = new Date(user.createdAt);
                    const now = new Date();
                    return userDate.getMonth() === now.getMonth() && 
                           userDate.getFullYear() === now.getFullYear();
                  }).length}</h4>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading users...</p>
              </div>
            ) : (
              <div className="users-container">
                {users.length === 0 ? (
                  <div className="empty-state">
                    <User size={48} />
                    <h3>No Users Found</h3>
                    <p>There are no registered users yet.</p>
                  </div>
                ) : (
                  <div className="users-list">
                    {users.map(user => (
                      <div key={user.id} className="user-card">
                        <div className="user-header">
                          <div className="user-avatar">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="user-info">
                            <h3 className="user-name">{user.name}</h3>
                            <p className="user-email">{user.email}</p>
                          </div>
                          <div className="user-joined">
                            Joined {formatDate(user.createdAt)}
                          </div>
                        </div>
                        
                        <div className="user-content">
                          <div className="user-stats">
                            <div className="user-stat">
                              <span className="stat-name">Orders</span>
                              <span className="stat-value">{user.orderCount || 0}</span>
                            </div>
                            <div className="user-stat">
                              <span className="stat-name">Total Spent</span>
                              <span className="stat-value">${user.totalSpent?.toFixed(2) || '0.00'}</span>
                            </div>
                            <div className="user-stat">
                              <span className="stat-name">Last Order</span>
                              <span className="stat-value">
                                {user.lastOrderDate 
                                  ? formatDate(user.lastOrderDate) 
                                  : 'Never'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="user-actions">
                            <button 
                              className="delete-user-btn"
                              onClick={() => handleDeleteUser(user.id, user.name)}
                              disabled={user.orderCount > 0}
                              title={user.orderCount > 0 ? "Cannot delete user with orders" : "Delete user"}
                            >
                              <Trash2 size={16} />
                              {user.orderCount > 0 ? 'Has Orders' : 'Delete User'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <AdminRoute>
      <Head>
        <title>Admin Dashboard - AnneYelina Beauty Store</title>
      </Head>
      <PublicLayout breadcrumb={breadcrumbsData} breadcrumbTitle='Admin Dashboard'>
        <div className="admin-dashboard">
          <div className="admin-sidebar">
            <ul className="admin-menu">
              <li className={activeTab === 'dashboard' ? 'active' : ''}>
                <button onClick={() => setActiveTab('dashboard')}>
                  <LayoutDashboard size={18} />
                  Dashboard
                </button>
              </li>
              <li className={activeTab === 'products' ? 'active' : ''}>
                <button onClick={() => setActiveTab('products')}>
                  <Package size={18} />
                  Products
                </button>
              </li>
              <li className={activeTab === 'orders' ? 'active' : ''}>
                <button onClick={() => setActiveTab('orders')}>
                  <ShoppingCart size={18} />
                  Orders
                </button>
              </li>
              <li className={activeTab === 'users' ? 'active' : ''}>
                <button onClick={() => setActiveTab('users')}>
                  <Users size={18} />
                  Users
                </button>
              </li>
            </ul>
          </div>
          
          <div className="admin-content">
            {renderContent()}
          </div>
        </div>
        <UserOrdersModal 
          show={showUserOrdersModal}
          onClose={() => setShowUserOrdersModal(false)}
          user={selectedUser}
          orders={userOrders}
          isLoading={userOrdersLoading}
        />
        <DeleteConfirmPopup
          show={showDeletePopup}
          item={itemToDelete?.type === 'product' ? 'Product' : ''}
          itemName={itemToDelete?.name}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeletePopup(false)}
        />
        <CategoryBrandManager
          show={showCategoryBrandManager}
          onClose={() => setShowCategoryBrandManager(false)}
          onCategoriesUpdate={handleCategoriesUpdate}
          onBrandsUpdate={handleBrandsUpdate}
        />
        {showOrderDetails && selectedOrder && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '800px',
              maxHeight: '90vh',
              overflow: 'auto'
            }}>
              <div style={{
                padding: '20px',
                borderBottom: '1px solid #eee',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h3 style={{ margin: 0, fontSize: '20px', color: '#333' }}>
                  Order Details
                </h3>
                <button
                  onClick={() => setShowOrderDetails(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '8px',
                    cursor: 'pointer',
                    color: '#666'
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <OrderDetails 
                order={selectedOrder} 
                onClose={() => setShowOrderDetails(false)}
              />
            </div>
          </div>
        )}
      </PublicLayout>
    </AdminRoute>
  );
} 