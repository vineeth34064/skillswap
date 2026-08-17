const socketHandler = (io) => {
  const onlineUsers = new Map(); // userId -> socketId

  io.on('connection', (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    // Register user presence
    socket.on('register_user', (userId) => {
      if (userId) {
        onlineUsers.set(userId.toString(), socket.id);
        socket.join(`user:${userId}`);
        io.emit('user_status_change', { userId, isOnline: true });
        console.log(`[Socket] Registered user ${userId} on socket ${socket.id}`);
      }
    });

    // Join conversation room
    socket.on('join_conversation', (conversationId) => {
      socket.join(`conversation:${conversationId}`);
      console.log(`[Socket] Socket ${socket.id} joined conversation:${conversationId}`);
    });

    // Send real-time chat message
    socket.on('send_message', (data) => {
      const { conversationId, message, recipientId } = data;
      socket.to(`conversation:${conversationId}`).emit('receive_message', message);

      if (recipientId) {
        io.to(`user:${recipientId}`).emit('new_chat_notification', {
          conversationId,
          senderName: message.senderId?.name || 'Someone',
          text: message.text
        });
      }
    });

    // Typing status
    socket.on('typing_start', ({ conversationId, userName }) => {
      socket.to(`conversation:${conversationId}`).emit('user_typing', { userName, isTyping: true });
    });

    socket.on('typing_stop', ({ conversationId }) => {
      socket.to(`conversation:${conversationId}`).emit('user_typing', { isTyping: false });
    });

    // Session update notification
    socket.on('notify_session_update', ({ targetUserId, session, title, message }) => {
      io.to(`user:${targetUserId}`).emit('session_updated', {
        session,
        title,
        message
      });
    });

    socket.on('disconnect', () => {
      for (const [userId, sId] of onlineUsers.entries()) {
        if (sId === socket.id) {
          onlineUsers.delete(userId);
          io.emit('user_status_change', { userId, isOnline: false });
          console.log(`[Socket] User ${userId} disconnected`);
          break;
        }
      }
    });
  });
};

module.exports = socketHandler;
