// Sample initial events data
let events = [
    {
        id: 1,
        title: "Local Jazz Night",
        description: "Enjoy an evening of smooth jazz with local musicians at the downtown cafe.",
        date: "2024-12-15",
        time: "19:00",
        location: "Downtown Coffee House",
        category: "music",
        image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop"
    },
    {
        id: 2,
        title: "Farmers Market",
        description: "Fresh produce, local crafts, and live music every Saturday morning.",
        date: "2024-12-16",
        time: "08:00",
        location: "Main Street Square",
        category: "food",
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop"
    },
    {
        id: 3,
        title: "Community Yoga",
        description: "Free yoga session in the park for all skill levels. Bring your own mat!",
        date: "2024-12-17",
        time: "09:00",
        location: "Central Park",
        category: "sports",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop"
    }
];

// DOM Elements
const eventsContainer = document.getElementById('eventsContainer');
const eventModal = document.getElementById('eventModal');
const eventForm = document.getElementById('eventForm');
const addEventBtn = document.getElementById('addEventBtn');
const cancelBtn = document.getElementById('cancelBtn');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const showPastEvents = document.getElementById('showPastEvents');

let showPast = false;

// Initialize the app
function init() {
    displayEvents(events);
    setupEventListeners();
}

// Set up all event listeners
function setupEventListeners() {
    addEventBtn.addEventListener('click', openModal);
    cancelBtn.addEventListener('click', closeModal);
    
    eventForm.addEventListener('submit', handleFormSubmit);
    
    searchInput.addEventListener('input', filterEvents);
    categoryFilter.addEventListener('change', filterEvents);
    showPastEvents.addEventListener('click', togglePastEvents);
    
    // Close modal when clicking outside
    eventModal.addEventListener('click', (e) => {
        if (e.target === eventModal) {
            closeModal();
        }
    });
}

// Display events in the grid
function displayEvents(eventsToDisplay) {
    const filteredEvents = eventsToDisplay.filter(event => {
        const eventDate = new Date(event.date + 'T' + event.time);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        return showPast ? eventDate < today : eventDate >= today;
    });

    if (filteredEvents.length === 0) {
        eventsContainer.innerHTML = '<div class="no-events">No events found. Be the first to add one!</div>';
        return;
    }

    eventsContainer.innerHTML = filteredEvents
        .sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time))
        .map(event => createEventCard(event))
        .join('');
}

// Create HTML for an event card
function createEventCard(event) {
    const eventDate = new Date(event.date + 'T' + event.time);
    const formattedDate = eventDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    const formattedTime = eventDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
    });

    return `
        <div class="event-card" data-category="${event.category}">
            <img src="${event.image || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&h=300&fit=crop'}" 
                 alt="${event.title}" class="event-image" 
                 onerror="this.src='https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&h=300&fit=crop'">
            <div class="event-content">
                <span class="event-category">${getCategoryName(event.category)}</span>
                <h3 class="event-title">${event.title}</h3>
                <div class="event-date">📅 ${formattedDate} at ${formattedTime}</div>
                <div class="event-location">📍 ${event.location}</div>
                <p class="event-description">${event.description}</p>
            </div>
        </div>
    `;
}

// Get display name for category
function getCategoryName(category) {
    const categories = {
        music: '🎵 Music',
        food: '🍕 Food & Drink',
        sports: '⚽ Sports',
        arts: '🎨 Arts & Culture',
        community: '👥 Community'
    };
    return categories[category] || category;
}

// Filter events based on search and category
function filterEvents() {
    const searchTerm = searchInput.value.toLowerCase();
    const category = categoryFilter.value;

    const filtered = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm) ||
                            event.description.toLowerCase().includes(searchTerm) ||
                            event.location.toLowerCase().includes(searchTerm);
        const matchesCategory = !category || event.category === category;
        
        return matchesSearch && matchesCategory;
    });

    displayEvents(filtered);
}

// Toggle between upcoming and past events
function togglePastEvents() {
    showPast = !showPast;
    showPastEvents.textContent = showPast ? 'Show Upcoming Events' : 'Show Past Events';
    filterEvents();
}

// Modal functions
function openModal() {
    eventModal.style.display = 'block';
    eventForm.reset();
}

function closeModal() {
    eventModal.style.display = 'none';
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const newEvent = {
        id: Date.now(), // Simple ID generation
        title: document.getElementById('eventTitle').value,
        description: document.getElementById('eventDescription').value,
        date: document.getElementById('eventDate').value,
        time: document.getElementById('eventTime').value,
        location: document.getElementById('eventLocation').value,
        category: document.getElementById('eventCategory').value,
        image: document.getElementById('eventImage').value || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&h=300&fit=crop'
    };
    
    events.push(newEvent);
    displayEvents(events);
    closeModal();
    
    // Reset filters to show the new event
    searchInput.value = '';
    categoryFilter.value = '';
    showPast = false;
    showPastEvents.textContent = 'Show Past Events';
}

// Set minimum date to today for the date picker
document.getElementById('eventDate').min = new Date().toISOString().split('T')[0];

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);