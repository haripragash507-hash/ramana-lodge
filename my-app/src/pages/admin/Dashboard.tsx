import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, LayoutDashboard, Tag, CalendarDays, LineChart as LineChartIcon, ArrowLeft, LogOut, Bell } from 'lucide-react';
import '../../styles/Dashboard.css';
import { RoomContext } from '../../context/RoomContext';
import { OfferContext } from '../../context/OfferContext';
import AutoSlider from '../../components/AutoSlider';
import { BookingHistoryContext } from '../../context/BookingHistoryContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { EditFormData } from '../../interfaces';
import AnalyticsLineChart from '../../components/graph/LineChart';
const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const roomContext = useContext(RoomContext);
  const rooms = roomContext ? roomContext.rooms : [];
  const updateContextRoom = roomContext?.updateRoom;
  const addContextRoom = roomContext?.addRoom;
  const deleteContextRoom = roomContext?.deleteRoom;

  const offerContext = useContext(OfferContext);
  const offers = offerContext ? offerContext.offers : [];
  const addOffer = offerContext?.addOffer;
  const deleteOffer = offerContext?.deleteOffer;

  // Consume BookingHistoryContext for shared bookings data
  const bookingContext = useContext(BookingHistoryContext);
  const bookings = bookingContext ? bookingContext.bookings : [];

  // Track offer form states
  const [isAddingOffer, setIsAddingOffer] = useState(false);
  const [offerFormData, setOfferFormData] = useState({ badge: '', title: '' });

  // State to track which room ID is currently being edited (null means none)
  const [editingRoomId, setEditingRoomId] = useState<number | null>(null);

  // State to track which room is queued for deletion (opens modal)
  const [roomToDelete, setRoomToDelete] = useState<{ id: number, name: string } | null>(null);

  // State to track if we are adding a brand new room
  const [isAddingRoom, setIsAddingRoom] = useState(false);

  // State to track active tab
  const [activeTab, setActiveTab] = useState<'rooms' | 'offers' | 'bookings' | 'graph'>(
    () => (sessionStorage.getItem('admin_dashboard_tab') as any) || 'rooms'
  );

  const [notifications, setNotifications] = useState<any[]>(() => {
    return JSON.parse(localStorage.getItem('lodge_admin_notifications') || '[]');
  });
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    // Basic polling mechanism to catch cross-tab syncs instantly
    const interval = setInterval(() => {
      setNotifications(JSON.parse(localStorage.getItem('lodge_admin_notifications') || '[]'));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const clearNotifications = () => {
    localStorage.setItem('lodge_admin_notifications', '[]');
    setNotifications([]);
    setShowNotifications(false);
  };

  // Booking filters
  const [searchQuery, setSearchQuery] = useState(() => sessionStorage.getItem('admin_search_query') || '');
  const [selectedMonth, setSelectedMonth] = useState(() => sessionStorage.getItem('admin_selected_month') || '');

  useEffect(() => {
    sessionStorage.setItem('admin_dashboard_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    sessionStorage.setItem('admin_search_query', searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    sessionStorage.setItem('admin_selected_month', selectedMonth);
  }, [selectedMonth]);

  // Derived filtered bookings
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.guestName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMonth = selectedMonth ? booking.dateBooked.startsWith(selectedMonth) : true;
    return matchesSearch && matchesMonth;
  });

  // PDF Generator handler
  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    doc.text("Total Bookings Report", 14, 15);
    
    const tableColumn = ["Booking ID", "Name", "Phone Number", "Aadhar", "Date", "Room"];
    const tableRows: any[] = [];

    filteredBookings.forEach(booking => {
      const bookingData = [
        booking.id,
        booking.guestName,
        booking.phone,
        booking.aadhar || 'N/A',
        new Date(booking.dateBooked).toLocaleDateString(),
        booking.roomName
      ];
      tableRows.push(bookingData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20
    });

    const fileName = selectedMonth ? `Bookings_Report_${selectedMonth}.pdf` : `Bookings_Report_All.pdf`;
    doc.save(fileName);
  };


  const [editFormData, setEditFormData] = useState<EditFormData>({
    name: '',
    price: 0,
    capacity: 0,
    imageUrls: [],
    description: '',
    isFreeCancellation: true
  });

  const handleLogout = () => {
    navigate('/login');
  };

  // Triggers when you click "Edit" on a specific room
  const handleEditClick = (room: any) => {
    setIsAddingRoom(false);
    setEditingRoomId(room.id);
    setEditFormData({
      name: room.name,
      price: room.price,
      capacity: room.capacity,
      imageUrls: room.imageUrls || [],
      description: room.description || '',
      isFreeCancellation: room.isFreeCancellation !== false
    });
  };

  // Triggers when you type in any of the edit inputs
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    // Checkbox support
    if (type === 'checkbox') {
      setEditFormData({
        ...editFormData,
        [name]: (e.target as HTMLInputElement).checked,
      });
      return;
    }

    setEditFormData({
      ...editFormData,
      [name]: name === 'price' || name === 'capacity' ? Number(value) : value,
    });
  };

  // Triggers when a user uploads image files
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    if (editFormData.imageUrls.length + files.length > 15) {
      alert("You can only upload a maximum of 15 images.");
      return;
    }

    const readers = files.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then(newImages => {
      setEditFormData(prev => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...newImages].slice(0, 15) // enforce limit purely locally too
      }));
    });
  };

  // Triggers when removing a previously uploaded image preview
  const handleRemoveImage = (indexToRemove: number) => {
    setEditFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== indexToRemove)
    }));
  };

  // Triggers when you click "Save"
  const handleSaveClick = (id: number) => {
    if (updateContextRoom) {
      updateContextRoom(id, editFormData);
    }
    setEditingRoomId(null); // Closes the edit form
  };

  const handleAddNewClick = () => {
    setEditingRoomId(null); // Close any active edits
    setIsAddingRoom(true);  // Open empty add form
    setEditFormData({
      name: '',
      price: 0,
      capacity: 0,
      imageUrls: [],
      description: '',
      isFreeCancellation: true
    });
  };

  const handleAddSaveClick = () => {
    if (addContextRoom) {
      addContextRoom({
        ...editFormData,
        description: editFormData.description || 'New feature room! You can edit this later.',
        badge: 'NEW'
      });
    }
    setIsAddingRoom(false);
  };

  return (
    <div className="admin-container">

      {/* DARK SIDEBAR (Matched from video) */}
      <aside className="admin-sidebar dark-theme">
        <div className="sidebar-brand">
          <Menu className="hamburger-icon" size={24} />
          <h2 className="brand-text">The Lodge</h2>
        </div>

        <div className="admin-profile">
          <p className="logged-in-text">LOGGED IN AS</p>
          <p className="admin-name">Administrator</p>
        </div>

        <nav className="sidebar-nav">
          <a href="#" className={`nav-item ${activeTab === 'rooms' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('rooms'); }}>
            <LayoutDashboard className="nav-icon" size={20} /> <span className="nav-text">Manage Rooms</span>
          </a>
          <a href="#" className={`nav-item ${activeTab === 'offers' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('offers'); }}>
            <Tag className="nav-icon" size={20} /> <span className="nav-text">Manage Offers</span>
          </a>
          <a href="#" className={`nav-item ${activeTab === 'bookings' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('bookings'); }}>
            <CalendarDays className="nav-icon" size={20} /> <span className="nav-text">Total Bookings</span>
          </a>
          <a href="#" className={`nav-item ${activeTab === 'graph' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('graph'); }}>
            <LineChartIcon className="nav-icon" size={20} /> <span className="nav-text">Analytics Graph</span>
          </a>
        </nav>

        <div className="sidebar-footer">
          <a href="/" className="back-website" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
            <ArrowLeft className="nav-icon" size={20} /> <span className="nav-text">Back to Website</span>
          </a>
          <button onClick={handleLogout} className="logout-text-btn">
            <LogOut className="nav-icon" size={20} /> <span className="nav-text">Sign out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="admin-main">
        <header className="admin-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Manage rooms, pricing, and lodge offers.</p>
          </div>
          {/* Notifications and Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', position: 'relative' }}>
            
            <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setShowNotifications(!showNotifications)}>
              <Bell size={24} color="#666" />
              {notifications.length > 0 && (
                <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#ef4444', color: 'white', borderRadius: '50%', width: '18px', height: '18px', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  {notifications.length}
                </span>
              )}
            </div>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div style={{ position: 'absolute', top: '40px', right: '50px', width: '320px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', zIndex: 100, border: '1px solid #eaeaea', overflow: 'hidden' }}>
                <div style={{ padding: '15px', borderBottom: '1px solid #eaeaea', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f9fafb' }}>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold' }}>Notifications</h3>
                  {notifications.length > 0 && (
                    <button onClick={clearNotifications} style={{ background: 'none', border: 'none', color: '#10b981', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}>Clear All</button>
                  )}
                </div>
                <div style={{ maxHeight: '300px', overflowY: 'auto', padding: '10px' }}>
                  {notifications.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#999', fontSize: '14px', margin: '20px 0' }}>No new notifications.</p>
                  ) : (
                    notifications.slice().reverse().map((n, i) => (
                      <div key={i} style={{ padding: '10px', borderBottom: '1px solid #f1f5f9', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <span style={{ fontWeight: '500', color: '#1f2937' }}>{n.text}</span>
                        <span style={{ color: '#94a3b8', fontSize: '11px' }}>{new Date(n.time).toLocaleString()}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            <div className="header-profile-icon">A</div>
          </div>
        </header>

        {/* MANAGE ROOMS SECTION */}
        {activeTab === 'rooms' && (
          <section className="manage-section">
            <div className="section-header">
              <h2>Manage Rooms</h2>
              <button className="add-new-btn" onClick={handleAddNewClick}>+ Add New Room</button>
            </div>

            <div className="room-list">

              {/* ADD NEW ROOM FORM (Shows if isAddingRoom is true) */}
              {isAddingRoom && (
                <div className="room-card" style={{ border: '2px dashed #1e7b5e' }}>
                  <div className="edit-room-form" style={{ backgroundColor: 'white' }}>
                    <div className="form-grid">
                      <div className="input-group">
                        <label>UPLOAD IMAGES (Max 15)</label>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          style={{ padding: '7px' }}
                        />
                        {editFormData.imageUrls.length > 0 && (
                          <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                            {editFormData.imageUrls.map((url, i) => (
                              <div key={i} style={{ position: 'relative' }}>
                                <img src={url} alt="preview" style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ccc' }} />
                                <button
                                  onClick={(e) => { e.preventDefault(); handleRemoveImage(i); }}
                                  style={{
                                    position: 'absolute', top: '-6px', right: '-6px',
                                    backgroundColor: '#e74c3c', color: 'white', border: 'none',
                                    borderRadius: '50%', width: '18px', height: '18px',
                                    fontSize: '12px', display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', cursor: 'pointer', padding: 0, fontWeight: 'bold'
                                  }}
                                >
                                  &times;
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="input-group">
                        <label>ROOM NAME</label>
                        <input type="text" name="name" value={editFormData.name} onChange={handleFormChange} placeholder="e.g. The Grand Alpine Suite" />
                      </div>
                      <div className="input-row">
                        <div className="input-group">
                          <label>PRICE / DAY (₹)</label>
                          <input type="number" name="price" value={editFormData.price} onChange={handleFormChange} />
                        </div>
                        <div className="input-group">
                          <label>CAPACITY</label>
                          <input type="number" name="capacity" value={editFormData.capacity} onChange={handleFormChange} />
                        </div>
                        <div className="input-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '8px', alignSelf: 'flex-end', paddingBottom: '12px' }}>
                          <input
                            type="checkbox"
                            name="isFreeCancellation"
                            checked={editFormData.isFreeCancellation}
                            onChange={handleFormChange}
                            style={{ margin: 0, width: '18px', height: '18px', cursor: 'pointer' }}
                          />
                          <label style={{ margin: 0, cursor: 'pointer', fontSize: '12px' }}>FREE CANCELLATION</label>
                        </div>
                      </div>
                      <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                        <label>DESCRIPTION</label>
                        <textarea
                          name="description"
                          value={editFormData.description}
                          onChange={handleFormChange}
                          rows={3}
                          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontFamily: 'Outfit, sans-serif' }}
                          placeholder="Describe the beautiful features of this room..."
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <button className="save-btn" onClick={handleAddSaveClick}>
                        &#10010; Create
                      </button>
                      <button className="edit-btn" onClick={() => setIsAddingRoom(false)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {rooms.map((room) => (
                <div key={room.id} className="room-card">

                  {/* CONDITIONAL RENDERING: Show Form if editing, else show details */}
                  {editingRoomId === room.id ? (

                    /* THE EDIT FORM */
                    <div className="edit-room-form">
                      <div className="form-grid">
                        <div className="input-group">
                          <label>UPLOAD NEW IMAGES (Max 15)</label>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            style={{ padding: '7px' }}
                          />
                          {/* Show tiny previews with cancel buttons */}
                          {editFormData.imageUrls.length > 0 && (
                            <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                              {editFormData.imageUrls.map((url, i) => (
                                <div key={i} style={{ position: 'relative' }}>
                                  <img src={url} alt="preview" style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ccc' }} />
                                  <button
                                    onClick={(e) => { e.preventDefault(); handleRemoveImage(i); }}
                                    style={{
                                      position: 'absolute', top: '-6px', right: '-6px',
                                      backgroundColor: '#e74c3c', color: 'white', border: 'none',
                                      borderRadius: '50%', width: '18px', height: '18px',
                                      fontSize: '12px', display: 'flex', alignItems: 'center',
                                      justifyContent: 'center', cursor: 'pointer', padding: 0, fontWeight: 'bold'
                                    }}
                                  >
                                    &times;
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="input-group">
                          <label>ROOM NAME</label>
                          <input
                            type="text"
                            name="name"
                            value={editFormData.name}
                            onChange={handleFormChange}
                            placeholder="e.g. The Grand Alpine Suite"
                          />
                        </div>
                        <div className="input-row">
                          <div className="input-group">
                            <label>PRICE / DAY (₹)</label>
                            <input
                              type="number"
                              name="price"
                              value={editFormData.price}
                              onChange={handleFormChange}
                            />
                          </div>
                          <div className="input-group">
                            <label>CAPACITY</label>
                            <input
                              type="number"
                              name="capacity"
                              value={editFormData.capacity}
                              onChange={handleFormChange}
                            />
                          </div>
                          <div className="input-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '8px', alignSelf: 'flex-end', paddingBottom: '12px' }}>
                            <input
                              type="checkbox"
                              name="isFreeCancellation"
                              checked={editFormData.isFreeCancellation}
                              onChange={handleFormChange}
                              style={{ margin: 0, width: '18px', height: '18px', cursor: 'pointer' }}
                            />
                            <label style={{ margin: 0, cursor: 'pointer', fontSize: '12px' }}>FREE CANCELLATION</label>
                          </div>
                        </div>
                        <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                          <label>DESCRIPTION</label>
                          <textarea
                            name="description"
                            value={editFormData.description}
                            onChange={handleFormChange}
                            rows={3}
                            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontFamily: 'Outfit, sans-serif' }}
                          />
                        </div>
                      </div>
                      <button className="save-btn" onClick={() => handleSaveClick(room.id)}>
                        &#128190; Save
                      </button>
                    </div>

                  ) : (

                    /* THE DISPLAY VIEW */
                    <div className="room-display">
                      <div style={{ width: '180px', height: '120px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0 }}>
                        <AutoSlider images={room.imageUrls && room.imageUrls.length > 0 ? room.imageUrls : ['https://images.unsplash.com/photo-1623719266155-24d10baef2ac?auto=format&fit=crop&w=400&q=80']} />
                      </div>

                      <div className="room-details">
                        <div className="room-title-row">
                          <h3>{room.name}</h3>
                          <span className="room-price">₹{room.price} <small>/day</small></span>
                        </div>
                        <span className="room-capacity">Cabin • Up to {room.capacity} guests</span>
                        <p className="room-desc">{room.description}</p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <button className="edit-btn" onClick={() => handleEditClick(room)}>
                          &#9998; Edit
                        </button>
                        <button
                          className="edit-btn"
                          style={{ color: '#ef4444', borderColor: '#fecaca' }}
                          onClick={() => setRoomToDelete({ id: room.id, name: room.name })}
                        >
                          &#128465; Delete
                        </button>
                      </div>
                    </div>

                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* MANAGE OFFERS SECTION (Static placeholder to match video) */}
        {activeTab === 'offers' && (
          <section className="manage-section offers-section-admin">
            <div className="section-header">
              <h2>Manage Offers</h2>
              <button className="add-new-btn" onClick={() => setIsAddingOffer(true)}>+ Add New Offer</button>
            </div>

            {isAddingOffer && (
              <div className="offer-card-admin" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="Badge (e.g. 20% OFF)"
                  value={offerFormData.badge}
                  onChange={(e) => setOfferFormData({ ...offerFormData, badge: e.target.value })}
                  style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <input
                  type="text"
                  placeholder="Title (e.g. Weekend Getaway)"
                  value={offerFormData.title}
                  onChange={(e) => setOfferFormData({ ...offerFormData, title: e.target.value })}
                  style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className="save-btn"
                    onClick={() => {
                      if (addOffer && offerFormData.badge && offerFormData.title) {
                        addOffer(offerFormData);
                        setOfferFormData({ badge: '', title: '' });
                        setIsAddingOffer(false);
                      }
                    }}
                    style={{ flex: 1, padding: '8px 0', fontSize: '14px' }}
                  >
                    Save
                  </button>
                  <button
                    className="edit-btn"
                    onClick={() => setIsAddingOffer(false)}
                    style={{ flex: 1, padding: '8px 0', fontSize: '14px' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="offers-grid">
              {offers.map(offer => (
                <div key={offer.id} className="offer-card-admin" style={{ position: 'relative' }}>
                  <button
                    onClick={() => deleteOffer && deleteOffer(offer.id)}
                    style={{
                      position: 'absolute', top: '10px', right: '10px', background: '#ef4444',
                      color: 'white', border: 'none', borderRadius: '50%', width: '24px',
                      height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                  >&times;</button>
                  <span className="offer-badge">{offer.badge}</span>
                  <h3>{offer.title}</h3>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TOTAL BOOKINGS SECTION */}
        {activeTab === 'bookings' && (
          <section className="manage-section">
            <div className="section-header" style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2>Total Bookings</h2>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <input 
                  type="text" 
                  placeholder="Search by name..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none' }}
                />
                <input 
                  type="month" 
                  value={selectedMonth}
                  onChange={e => setSelectedMonth(e.target.value)}
                  style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none' }}
                />
                <button className="add-new-btn" onClick={handleDownloadPdf}>Download PDF</button>
              </div>
            </div>
            <div className="table-container" style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '12px 8px', color: '#475569', fontWeight: '600' }}>Booking ID</th>
                    <th style={{ padding: '12px 8px', color: '#475569', fontWeight: '600' }}>Name</th>
                    <th style={{ padding: '12px 8px', color: '#475569', fontWeight: '600' }}>Phone Number</th>
                    <th style={{ padding: '12px 8px', color: '#475569', fontWeight: '600' }}>Aadhar</th>
                    <th style={{ padding: '12px 8px', color: '#475569', fontWeight: '600' }}>Date</th>
                    <th style={{ padding: '12px 8px', color: '#475569', fontWeight: '600' }}>Room</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map(booking => (
                    <tr key={booking.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '16px 8px', color: '#64748b' }}>{booking.id}</td>
                      <td style={{ padding: '16px 8px', fontWeight: '500', color: '#0f172a' }}>{booking.guestName}</td>
                      <td style={{ padding: '16px 8px', color: '#334155' }}>{booking.phone}</td>
                      <td style={{ padding: '16px 8px', color: '#334155' }}>{booking.aadhar || 'N/A'}</td>
                      <td style={{ padding: '16px 8px', color: '#334155' }}>{new Date(booking.dateBooked).toLocaleDateString()}</td>
                      <td style={{ padding: '16px 8px', color: '#334155' }}>{booking.roomName}</td>
                    </tr>
                  ))}
                  {filteredBookings.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ padding: '20px', textAlign: 'center', color: '#666' }}>No bookings found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ANALYTICS GRAPH SECTION */}
        {activeTab === 'graph' && (
          <AnalyticsLineChart bookings={bookings} />
        )}

        {/* CUSTOM DELETE CONFIRMATION POPUP */}
        {roomToDelete && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', zIndex: 9999
          }}>
            <div style={{
              background: 'white', padding: '30px', borderRadius: '12px',
              width: '90%', maxWidth: '400px', position: 'relative', textAlign: 'center',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ color: '#ef4444', marginTop: 0, fontSize: '22px', fontFamily: 'Georgia, serif' }}>Delete Room?</h2>
              <p style={{ color: '#444', marginBottom: '24px', fontSize: '15px' }}>
                Are you sure you want to delete <strong>{roomToDelete.name}</strong>? This action cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  onClick={() => setRoomToDelete(null)}
                  style={{
                    background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', padding: '10px 24px',
                    borderRadius: '6px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', flex: 1
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (deleteContextRoom) deleteContextRoom(roomToDelete.id);
                    setRoomToDelete(null);
                  }}
                  style={{
                    background: '#ef4444', color: 'white', border: 'none', padding: '10px 24px',
                    borderRadius: '6px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', flex: 1
                  }}
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default Dashboard;