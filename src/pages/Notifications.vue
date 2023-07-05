<template>
  <div class="content">
    <h2>Notifications</h2>
    <div class="container-fluid">
      <div class="row">
        <ul class="notification-list">
          <li v-for="notification in notifications" :key="notification.id">
            <div class="notification">
              <div class="notification-icon">
                <i :class="notification.icon"></i>
              </div>
              <div class="notification-content">
                <div class="notification-header">
                  <h5 class="notification-title" v-html="notification.title"></h5>
                  <div class="notification-time">{{ formatDateTime(notification.created_at) }}</div>
                </div>
                <div class="notification-details">
                  <span class="notification-time-ago">{{ notification.time_ago }}</span>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <div v-if="notifications.length === 0" class="no-notifications">No notifications</div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      notifications: []
    };
  },
  created() {
    this.fetchNotifications();
  },
  methods: {
    fetchNotifications() {
      const apiUrl = 'https://sgms.bse23-5.one/api/notifications';
      const authToken = '105|0mD2x7SCPFQCjmyYWMdhuwuP9b48jxwQWG7lft2X'; 

      axios
        .get(apiUrl, {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        })
        .then(response => {
          this.notifications = response.data.notifications;
          
        })
        .catch(error => {
          console.error('Failed to fetch notifications:', error);
        });
    },
    formatDateTime(datetime) {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
      return new Date(datetime).toLocaleDateString('en-US', options);
    }
  }
};
</script>

<style lang="scss">
.notification-list {
  list-style-type: none;
  padding: 0;
}

.notification {
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 5px;
  background-color: #f9f9f9;
  margin-bottom: 10px;
}

.notification-icon {
  margin-right: 10px;
}

.notification-icon i {
  font-size: 24px;
  color: #3498db;
}

.notification-content {
  flex-grow: 1;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notification-title {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
}

.notification-time {
  font-size: 12px;
  color: #777;
}

.notification-details {
  margin-top: 5px;
}

.notification-time-ago {
  font-size: 12px;
  color: #777;
}

.no-notifications {
  font-size: 14px;
  color: #777;
  margin-top: 10px;
}
</style>
