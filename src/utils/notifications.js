export const sendDeadlineNotification = (task) => {
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  } else {
    new Notification("Task Deadline Reached", {
      body: `Your task "${task.text}" is now overdue!`,
      icon: "/logo192.png",
    });
  }
};

export const sendOneHourBeforeNotification = (task) => {
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  } else {
    new Notification("Task Due in 1 Hour", {
      body: `Your task "${task.text}" is due in one hour!`,
      icon: "/logo192.png",
    });
  }
};

export const sendCompletionNotification = (task) => {
  if (Notification.permission === "granted") {
    new Notification("Task Completed", {
      body: `You've marked "${task.text}" as complete.`,
      icon: "/logo192.png",
    });
  }
};
