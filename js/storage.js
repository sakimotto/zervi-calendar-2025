// Load saved events from localStorage or use defaults
const holidays = JSON.parse(localStorage.getItem('zerviCalendar2025')) || {
    thai: [
        { date: '2025-01-01', name: "New Year's Day 2025", category: 'holiday' },
        { date: '2025-01-02', name: "New Year's Day 2025", category: 'holiday' },
        { date: '2025-04-14', name: "Songkran Festival Day", category: 'holiday' },
        { date: '2025-04-15', name: "Songkran Festival Day", category: 'holiday' },
        { date: '2025-04-16', name: "Songkran Festival Day", category: 'holiday' },
        { date: '2025-04-17', name: "Songkran Festival Day", category: 'holiday' },
        { date: '2025-04-18', name: "Songkran Festival Day", category: 'holiday' },
        { date: '2025-04-19', name: "Songkran Festival Day", category: 'holiday' },
        { date: '2025-05-01', name: "National Labor Day", category: 'holiday' },
        { date: '2025-05-12', name: "Visakha Bucha Day", category: 'holiday' },
        { date: '2025-06-03', name: "H.M. The Queen's Birthday", category: 'holiday' },
        { date: '2025-07-28', name: "H.M. The King's Birthday", category: 'holiday' },
        { date: '2025-08-12', name: "Mother's Day", category: 'holiday' },
        { date: '2025-10-13', name: "King Bhumibol Adulyadej Memorial Day", category: 'holiday' },
        { date: '2025-12-05', name: "Father's Day", category: 'holiday' },
        { date: '2025-12-26', name: "Christmas Day Vacation Management", category: 'holiday' },
        { date: '2025-12-27', name: "Christmas Day Vacation Management", category: 'holiday' },
        { date: '2025-12-29', name: "Christmas Day Vacation Management", category: 'holiday' },
        { date: '2025-12-30', name: "Christmas Day Vacation Management", category: 'holiday' },
        { date: '2025-12-31', name: "New Year's 2025", category: 'holiday' }
    ],
    aus: [
        { date: '2025-01-26', name: "Australia Day", category: 'holiday' }
    ]
};

// Calendar state
let currentMonth = new Date().getMonth();
let showAllMonths = true;

// Event type styles
const eventTypes = {
    holiday: { aus: 'zervi-aus', thai: 'zervi-thai' },
    'trade-show': 'event-trade-show',
    company: 'event-company',
    travel: 'event-travel',
    product: 'event-product'
};

// Calendar rendering
function renderEvents(dayDiv, currentDate) {
    const holidayContainer = document.createElement('div');
    holidayContainer.style.display = 'flex';
    holidayContainer.style.flexDirection = 'column';
    holidayContainer.style.gap = '2px';

    // Render Thai events
    if (document.getElementById('showThai').checked) {
        holidays.thai.forEach(event => {
            if (event.date === currentDate) {
                const eventDiv = document.createElement('div');
                let className = 'holiday-label ';
                
                // Apply appropriate class based on event category
                if (event.category === 'holiday') {
                    className += 'zervi-thai';
                } else {
                    className += `event-${event.category}`;
                }
                
                eventDiv.className = className;
                eventDiv.innerHTML = `
                    <span>${event.name}</span>
                    <div class="event-actions">
                        <button onclick="viewEvent('${event.date}', 'thai', ${holidays.thai.indexOf(event)})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button onclick="editEvent('${event.date}', 'thai', ${holidays.thai.indexOf(event)})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deleteEvent('${event.date}', 'thai', ${holidays.thai.indexOf(event)})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                holidayContainer.appendChild(eventDiv);
                dayDiv.classList.add('holiday');
            }
        });
    }

    // Render Australian events
    if (document.getElementById('showAus').checked) {
        holidays.aus.forEach(event => {
            if (event.date === currentDate) {
                const eventDiv = document.createElement('div');
                let className = 'holiday-label ';
                
                if (event.category === 'holiday') {
                    className += 'zervi-aus';
                } else {
                    className += `event-${event.category}`;
                }
                
                eventDiv.className = className;
                eventDiv.innerHTML = `
                    <span>${event.name}</span>
                    <div class="event-actions">
                        <button onclick="viewEvent('${event.date}', 'aus', ${holidays.aus.indexOf(event)})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button onclick="editEvent('${event.date}', 'aus', ${holidays.aus.indexOf(event)})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deleteEvent('${event.date}', 'aus', ${holidays.aus.indexOf(event)})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                holidayContainer.appendChild(eventDiv);
                dayDiv.classList.add('holiday');
            }
        });
    }

    if (holidayContainer.children.length > 0) {
        dayDiv.appendChild(holidayContainer);
    }
}

function createCalendar() {
    const calendar = document.getElementById('calendar');
    if (!calendar) {
        console.error('Calendar container not found');
        return;
    }
    calendar.innerHTML = '';

    const months = showAllMonths ? [0,1,2,3,4,5,6,7,8,9,10,11] : [currentMonth];
    
    months.forEach(month => {
        const monthDiv = document.createElement('div');
        monthDiv.className = 'month';
        
        const monthTitle = document.createElement('div');
        monthTitle.className = 'month-title';
        monthTitle.textContent = new Date(2025, month, 1).toLocaleString('default', { month: 'long' });
        monthDiv.appendChild(monthTitle);

        const weekdaysDiv = document.createElement('div');
        weekdaysDiv.className = 'weekdays';
        ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
            const dayDiv = document.createElement('div');
            dayDiv.textContent = day;
            weekdaysDiv.appendChild(dayDiv);
        });
        monthDiv.appendChild(weekdaysDiv);

        const daysDiv = document.createElement('div');
        daysDiv.className = 'days';

        const firstDay = new Date(2025, month, 1);
        const lastDay = new Date(2025, month + 1, 0);
        const daysInMonth = lastDay.getDate();

        // Add empty cells for days before the first of the month
        for (let i = 0; i < firstDay.getDay(); i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'day';
            daysDiv.appendChild(emptyDay);
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'day';
            dayDiv.innerHTML = `<span>${day}</span>`;

            const currentDate = `2025-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            renderEvents(dayDiv, currentDate);

            daysDiv.appendChild(dayDiv);
        }

        monthDiv.appendChild(daysDiv);
        calendar.appendChild(monthDiv);
    });
}

// Navigation functions
function previousMonth() {
    if (!showAllMonths) {
        currentMonth = (currentMonth - 1 + 12) % 12;
        createCalendar();
    }
}

function nextMonth() {
    if (!showAllMonths) {
        currentMonth = (currentMonth + 1) % 12;
        createCalendar();
    }
}

function toggleAllMonths() {
    showAllMonths = !showAllMonths;
    createCalendar();
    const button = document.querySelector('button:nth-child(2)');
    button.textContent = showAllMonths ? 'Show Current Month' : 'Show All Months';
}

// Event management functions
function addEvent() {
    const date = document.getElementById('eventDate').value;
    const name = document.getElementById('eventName').value;
    const company = document.getElementById('eventCompany').value;
    const category = document.getElementById('eventCategory').value;
    const description = document.getElementById('eventDescription').value;

    if (!date || !name) {
        alert('Please fill in required fields (Date and Name)');
        return;
    }

    const event = {
        date,
        name,
        category,
        description
    };

    if (company === 'both') {
        holidays.aus.push({...event});
        holidays.thai.push({...event});
    } else {
        holidays[company].push(event);
    }

    // Save to localStorage
    localStorage.setItem('zerviCalendar2025', JSON.stringify(holidays));

    createCalendar();
    
    // Clear form
    document.getElementById('eventDate').value = '';
    document.getElementById('eventName').value = '';
    document.getElementById('eventDescription').value = '';

    // Close the dropdown
    const dropdown = document.querySelector('.dropdown');
    dropdown.classList.remove('active');
}

function editEvent(date, company, index) {
    const event = holidays[company][index];
    
    // Populate form fields
    document.getElementById('editEventDate').value = event.date;
    document.getElementById('editEventName').value = event.name;
    document.getElementById('editEventCompanySelect').value = event.company || company;
    document.getElementById('editEventCategory').value = event.category;
    document.getElementById('editEventDescription').value = event.description || '';
    
    // Store reference to event
    document.getElementById('editEventIndex').value = index;
    document.getElementById('editEventCompany').value = company;
    
    // Show modal
    document.getElementById('editEventModal').classList.add('active');
}

function closeEditModal() {
    document.getElementById('editEventModal').classList.remove('active');
}

function updateEvent() {
    const index = parseInt(document.getElementById('editEventIndex').value);
    const company = document.getElementById('editEventCompany').value;
    
    const updatedEvent = {
        date: document.getElementById('editEventDate').value,
        name: document.getElementById('editEventName').value,
        category: document.getElementById('editEventCategory').value,
        description: document.getElementById('editEventDescription').value
    };

    if (!updatedEvent.date || !updatedEvent.name) {
        alert('Please fill in required fields (Date and Name)');
        return;
    }

    // Update event
    holidays[company][index] = updatedEvent;
    
    // Save to localStorage
    localStorage.setItem('zerviCalendar2025', JSON.stringify(holidays));
    
    // Refresh calendar
    createCalendar();
    
    // Close modal
    closeEditModal();
}

function deleteEvent(date, company, index) {
    const event = holidays[company][index];
    if (confirm(`Are you sure you want to delete "${event.name}" on ${date}?`)) {
        // Remove the event
        holidays[company].splice(index, 1);
        
        // If it was a "both" company event, remove from other company too
        if (event.company === 'both') {
            const otherCompany = company === 'aus' ? 'thai' : 'aus';
            const otherIndex = holidays[otherCompany].findIndex(e => 
                e.date === event.date && e.name === event.name
            );
            if (otherIndex !== -1) {
                holidays[otherCompany].splice(otherIndex, 1);
            }
        }
        
        // Save to localStorage
        localStorage.setItem('zerviCalendar2025', JSON.stringify(holidays));
        
        // Refresh calendar
        createCalendar();
    }
}

// Export/Import functions
function exportHolidays(format = 'json') {
    const showAus = document.getElementById('showAus').checked;
    const showThai = document.getElementById('showThai').checked;
    let exportData;
    let fileName;
    let fileContent;

    if (format === 'json') {
        exportData = {};
        if (showAus) exportData.aus = holidays.aus;
        if (showThai) exportData.thai = holidays.thai;
        fileContent = JSON.stringify(exportData, null, 2);
        fileName = 'zervi_holidays_2025.json';
    } else if (format === 'csv') {
        const rows = [['Date', 'Holiday Name', 'Company']];
        
        if (showAus) {
            holidays.aus.forEach(holiday => {
                rows.push([holiday.date, holiday.name, 'Zervi Australia']);
            });
        }
        
        if (showThai) {
            holidays.thai.forEach(holiday => {
                rows.push([holiday.date, holiday.name, 'Zervi Thailand']);
            });
        }
        
        fileContent = rows.map(row => row.map(cell => 
            cell.includes(',') ? `"${cell}"` : cell
        ).join(',')).join('\n');
        fileName = 'zervi_holidays_2025.csv';
    }

    const blob = new Blob([fileContent], { type: format === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function importHolidays() {
    const fileInput = document.getElementById('importFile');
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedHolidays = JSON.parse(e.target.result);
                Object.assign(holidays, importedHolidays);
                createCalendar();
                alert('Holidays imported successfully!');
            } catch (error) {
                alert('Error importing holidays. Please check the file format.');
            }
        };
        reader.readAsText(file);
    }
}

// UI Functions
function toggleEventForm(event) {
    event.preventDefault();
    const dropdown = event.currentTarget.parentElement;
    dropdown.classList.toggle('active');
    const icon = event.currentTarget.querySelector('.fa-chevron-down');
    icon.style.transform = dropdown.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0)';
}

function toggleDataManagement(event) {
    event.preventDefault();
    const dropdown = event.currentTarget.parentElement;
    dropdown.classList.toggle('active');
    const icon = event.currentTarget.querySelector('.fa-chevron-down');
    icon.style.transform = dropdown.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0)';
}

function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    
    const themeIcon = document.querySelector('.theme-toggle i');
    themeIcon.className = newTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// Event Details Modal Functions
let currentViewingEvent = null;

function viewEvent(date, company, index) {
    const event = holidays[company][index];
    currentViewingEvent = { date, company, index };
    
    // Format date for display
    const eventDate = new Date(date);
    const formattedDate = eventDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Update modal content
    document.getElementById('detailDate').value = event.date;
    document.getElementById('detailName').value = event.name;
    document.getElementById('detailCategory').value = event.category;
    document.getElementById('detailCompany').value = event.company || company;
    document.getElementById('detailDescription').value = event.description || '';
    document.getElementById('detailCreated').value = formatDateTime(event.created) || 'Not available';
    document.getElementById('detailModified').value = formatDateTime(event.modified) || 'Not available';
    
    // Show modal
    document.getElementById('eventDetailsModal').classList.add('active');
}

function closeDetailsModal() {
    document.getElementById('eventDetailsModal').classList.remove('active');
    currentViewingEvent = null;
}

function editEventFromDetails() {
    if (currentViewingEvent) {
        editEvent(
            currentViewingEvent.date,
            currentViewingEvent.company,
            currentViewingEvent.index
        );
        closeDetailsModal();
    }
}

function deleteEventFromDetails() {
    if (currentViewingEvent) {
        deleteEvent(
            currentViewingEvent.date,
            currentViewingEvent.company,
            currentViewingEvent.index
        );
        closeDetailsModal();
    }
}

// Helper function to format date-time
function formatDateTime(isoString) {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Initialize calendar and event handlers
document.addEventListener('DOMContentLoaded', function() {
    createCalendar();
    
    // Add event listeners
    document.getElementById('importFile').addEventListener('change', importHolidays);
    document.getElementById('showAus').addEventListener('change', createCalendar);
    document.getElementById('showThai').addEventListener('change', createCalendar);
    
    // Close modals when clicking outside
    document.getElementById('editEventModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeEditModal();
        }
    });
    
    document.getElementById('eventDetailsModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeDetailsModal();
        }
    });
    
    // Mobile menu toggle
    document.querySelector('.mobile-menu-toggle').addEventListener('click', () => {
        document.querySelector('.sidebar').classList.toggle('active');
    });
});
