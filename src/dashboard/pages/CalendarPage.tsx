import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'milestone' | 'task';
  description?: string;
}

export const CalendarPage: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedDateStr, setSelectedDateStr] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [modalType, setModalType] = useState<'milestone' | 'task'>('task');
  const [modalDesc, setModalDesc] = useState('');
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/calendar-events')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load calendar events');
        return res.json();
      })
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSaveEvents = async (updated: CalendarEvent[]) => {
    setEvents(updated);
    try {
      await fetch('/api/calendar-events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updated, null, 2),
      });
    } catch (err) {
      console.error('Failed to persist calendar events:', err);
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDayClick = (dateStr: string, existingEvent?: CalendarEvent) => {
    setSelectedDateStr(dateStr);
    if (existingEvent) {
      setEditingEventId(existingEvent.id);
      setModalTitle(existingEvent.title);
      setModalType(existingEvent.type);
      setModalDesc(existingEvent.description || '');
    } else {
      setEditingEventId(null);
      setModalTitle('');
      setModalType('task');
      setModalDesc('');
    }
    setShowModal(true);
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalTitle.trim()) return;

    if (editingEventId) {
      // Edit
      const updated = events.map((ev) =>
        ev.id === editingEventId
          ? { ...ev, title: modalTitle, type: modalType, description: modalDesc }
          : ev
      );
      handleSaveEvents(updated);
    } else {
      // Add
      const newEvent: CalendarEvent = {
        id: `ev-${Date.now()}`,
        title: modalTitle,
        date: selectedDateStr,
        type: modalType,
        description: modalDesc,
      };
      handleSaveEvents([...events, newEvent]);
    }
    setShowModal(false);
  };

  const handleDeleteEvent = () => {
    if (!editingEventId) return;
    const updated = events.filter((ev) => ev.id !== editingEventId);
    handleSaveEvents(updated);
    setShowModal(false);
  };

  // Helper calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const prevMonthTotalDays = new Date(year, month, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Days array to render
  const calendarCells: { dateStr: string; dayNum: number; isCurrentMonth: boolean }[] = [];

  // Previous month overflow days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const prevYear = month === 0 ? year - 1 : year;
    const prevMon = month === 0 ? 11 : month - 1;
    const dayVal = prevMonthTotalDays - i;
    const dateStr = `${prevYear}-${(prevMon + 1).toString().padStart(2, '0')}-${dayVal.toString().padStart(2, '0')}`;
    calendarCells.push({ dateStr, dayNum: dayVal, isCurrentMonth: false });
  }

  // Current month days
  for (let i = 1; i <= totalDays; i++) {
    const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
    calendarCells.push({ dateStr, dayNum: i, isCurrentMonth: true });
  }

  // Next month overflow days
  const remainingCells = 42 - calendarCells.length; // 6 rows of 7 days
  for (let i = 1; i <= remainingCells; i++) {
    const nextYear = month === 11 ? year + 1 : year;
    const nextMon = month === 11 ? 0 : month + 1;
    const dateStr = `${nextYear}-${(nextMon + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
    calendarCells.push({ dateStr, dayNum: i, isCurrentMonth: false });
  }

  const todayStr = new Date().toISOString().slice(0, 10);

  return (
    <StyledCalendarPage>
      <div className="calendar-layout">
        {/* Main Grid View */}
        <div className="calendar-main">
          <div className="calendar-header">
            <h2>{monthNames[month]} {year}</h2>
            <div className="nav-buttons">
              <button className="nav-btn" onClick={handlePrevMonth}>
                &larr; Prev
              </button>
              <button className="nav-btn today-btn" onClick={() => setCurrentDate(new Date())}>
                Today
              </button>
              <button className="nav-btn" onClick={handleNextMonth}>
                Next &rarr;
              </button>
            </div>
          </div>

          <div className="days-header-grid">
            {daysOfWeek.map((day) => (
              <div key={day} className="day-header">{day}</div>
            ))}
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="calendar-days-grid">
              {calendarCells.map((cell, idx) => {
                const dayEvents = events.filter((ev) => ev.date === cell.dateStr);
                const isToday = cell.dateStr === todayStr;

                return (
                  <div
                    key={idx}
                    className={`day-cell ${cell.isCurrentMonth ? '' : 'other-month'} ${isToday ? 'today' : ''}`}
                    onClick={() => handleDayClick(cell.dateStr)}
                  >
                    <span className="day-number">{cell.dayNum}</span>
                    <div className="events-container">
                      {dayEvents.map((ev) => (
                        <div
                          key={ev.id}
                          className={`event-badge ${ev.type}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDayClick(cell.dateStr, ev);
                          }}
                          title={ev.description || ev.title}
                        >
                          {ev.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Side Panel showing upcoming tasks */}
        <div className="calendar-side">
          <h3>Upcoming Milestones</h3>
          <div className="upcoming-list">
            {events
              .filter((ev) => ev.date >= todayStr)
              .sort((a, b) => a.date.localeCompare(b.date))
              .slice(0, 5)
              .map((ev) => (
                <div key={ev.id} className={`upcoming-card ${ev.type}`}>
                  <div className="card-header">
                    <span className="event-date">{new Date(ev.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span className={`type-tag ${ev.type}`}>{ev.type}</span>
                  </div>
                  <h4>{ev.title}</h4>
                  {ev.description && <p>{ev.description}</p>}
                </div>
              ))}
            {events.filter((ev) => ev.date >= todayStr).length === 0 && (
              <div className="empty-upcoming">No upcoming events scheduled. Click a date to add one!</div>
            )}
          </div>
        </div>
      </div>

      {/* Add / Edit Event Dialog Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingEventId ? 'Edit Event Details' : 'Schedule Custom Event'}</h3>
            <p className="modal-date">Date: {new Date(selectedDateStr).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
            <form onSubmit={handleModalSubmit}>
              <div className="form-group">
                <label>Event Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Sprint Release, Testing, Holiday"
                  value={modalTitle}
                  onChange={(e) => setModalTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Event Type</label>
                <select
                  value={modalType}
                  onChange={(e) => setModalType(e.target.value as any)}
                >
                  <option value="task">Task / To-Do</option>
                  <option value="milestone">Project Milestone</option>
                </select>
              </div>

              <div className="form-group">
                <label>Description / Notes</label>
                <textarea
                  rows={3}
                  placeholder="Details about this milestone/task..."
                  value={modalDesc}
                  onChange={(e) => setModalDesc(e.target.value)}
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="save-btn">
                  Save Event
                </button>
                {editingEventId && (
                  <button type="button" className="delete-btn" onClick={handleDeleteEvent}>
                    Delete
                  </button>
                )}
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </StyledCalendarPage>
  );
};

const StyledCalendarPage = styled.div`
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  min-height: calc(100vh - 240px);

  .calendar-layout {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 1.5rem;

    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
    }
  }

  /* Main Grid */
  .calendar-main {
    display: flex;
    flex-direction: column;
  }

  .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.25rem;

    h2 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #0b1e30;
    }

    .nav-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .nav-btn {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 0.5rem 0.85rem;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 600;
      color: #475569;
      cursor: pointer;
      transition: background 180ms ease;

      &:hover {
        background: #f1f5f9;
        color: #0b1e30;
      }

      &.today-btn {
        background: #eff6ff;
        border-color: #bfdbfe;
        color: #1A73E8;

        &:hover {
          background: #e0edff;
        }
      }
    }
  }

  .days-header-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .day-header {
    text-align: center;
    font-size: 0.85rem;
    font-weight: 700;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .loading-container {
    height: 400px;
    display: grid;
    place-items: center;

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #f3f3f3;
      border-top: 3px solid #1A73E8;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
  }

  .calendar-days-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: repeat(6, 1fr);
    gap: 1px;
    background: #e2e8f0;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    overflow: hidden;
  }

  .day-cell {
    background: #fff;
    min-height: 100px;
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    cursor: pointer;
    transition: background 180ms ease;

    &:hover {
      background: #f8fafc;
    }

    &.other-month {
      background: #f8fafc;
      color: #94a3b8;
      
      .day-number {
        opacity: 0.5;
      }
    }

    &.today {
      background: #eff6ff;

      .day-number {
        background: #1A73E8;
        color: #fff;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: inline-grid;
        place-items: center;
        margin: -4px 0 0 -4px;
      }
    }
  }

  .day-number {
    font-size: 0.85rem;
    font-weight: 600;
    color: #475569;
  }

  .events-container {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    overflow-y: auto;
    max-height: 70px;
  }

  .event-badge {
    font-size: 0.72rem;
    font-weight: 700;
    padding: 0.15rem 0.35rem;
    border-radius: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &.task {
      background: #f1f5f9;
      color: #475569;
      border-left: 3px solid #64748b;
    }

    &.milestone {
      background: #eff6ff;
      color: #1e40af;
      border-left: 3px solid #1A73E8;
    }

    &:hover {
      opacity: 0.85;
      transform: translateY(-0.5px);
    }
  }

  /* Sidebar tasks list */
  .calendar-side {
    background: #f8fafc;
    border-radius: 8px;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    h3 {
      font-size: 1.1rem;
      font-weight: 700;
      color: #0b1e30;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 0.5rem;
    }
  }

  .upcoming-list {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
  }

  .upcoming-card {
    background: #fff;
    padding: 0.85rem;
    border-radius: 6px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);

    h4 {
      font-size: 0.9rem;
      font-weight: 700;
      color: #334155;
      margin: 0.25rem 0;
    }

    p {
      font-size: 0.76rem;
      color: #64748b;
      margin: 0;
      line-height: 1.4;
    }

    &.milestone {
      border-left: 4px solid #1A73E8;
    }

    &.task {
      border-left: 4px solid #64748b;
    }
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.72rem;
    
    .event-date {
      color: #94a3b8;
      font-weight: 600;
    }

    .type-tag {
      text-transform: uppercase;
      font-size: 0.65rem;
      font-weight: 700;
      padding: 0.1rem 0.3rem;
      border-radius: 3px;

      &.milestone {
        background: #e0edff;
        color: #1A73E8;
      }
      &.task {
        background: #f1f5f9;
        color: #475569;
      }
    }
  }

  .empty-upcoming {
    text-align: center;
    font-size: 0.8rem;
    color: #94a3b8;
    padding: 2rem 0;
  }

  /* Modal Form */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    display: grid;
    place-items: center;
    z-index: 1000;
    backdrop-filter: blur(2px);
  }

  .modal-content {
    background: #fff;
    border-radius: 12px;
    padding: 1.75rem;
    width: 100%;
    max-width: 450px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);

    h3 {
      font-size: 1.25rem;
      font-weight: 700;
      color: #0b1e30;
      margin: 0 0 0.25rem;
    }

    .modal-date {
      font-size: 0.85rem;
      color: #64748b;
      margin-bottom: 1.25rem;
    }
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    margin-bottom: 1rem;

    label {
      font-size: 0.82rem;
      font-weight: 600;
      color: #475569;
    }

    input, select, textarea {
      padding: 0.6rem;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      font-size: 0.88rem;
      outline: none;
      transition: border 180ms ease;

      &:focus {
        border-color: #1A73E8;
      }
    }
  }

  .modal-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 1.5rem;
    justify-content: flex-end;

    button {
      padding: 0.55rem 1rem;
      border-radius: 6px;
      font-size: 0.88rem;
      font-weight: 600;
      cursor: pointer;
    }

    .save-btn {
      background: #1A73E8;
      color: #fff;
      border: none;

      &:hover {
        background: #1557B0;
      }
    }

    .delete-btn {
      background: #fee2e2;
      color: #b91c1c;
      border: 1px solid #fca5a5;

      &:hover {
        background: #fecaca;
      }
    }

    .cancel-btn {
      background: #fff;
      border: 1px solid #cbd5e1;
      color: #475569;

      &:hover {
        background: #f8fafc;
      }
    }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
