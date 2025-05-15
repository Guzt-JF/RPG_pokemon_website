import React, { useEffect, useState } from 'react';

const Notification = ({ color = 'red', message, setMessage }) => {
    const [visible, setVisible] = useState(true);
    const [timer, setTimer] = useState(5); // Timer starts at 5 seconds
    const [progress, setProgress] = useState(100); // Progress bar starts at 100%

    useEffect(() => {
        if (!message) {
            setVisible(false);
            return;
        }

        setVisible(true);
        setTimer(5); // Reset timer
        setProgress(100); // Reset progress bar

        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev > 0) {
                    return prev - 1;
                }
                return 0;
            });
            setProgress((prev) => Math.max(prev - 20, 0)); // Decrease progress by 20% every second
        }, 1000);

        const timeout = setTimeout(() => {
            setVisible(false);
            setMessage('');
        }, 5000);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [message]);

    if (!visible) return null;

    return (
        <div style={styles.container}>
            <div style={styles.notification}>
                {message}
            </div>
            <div style={{ ...styles.progressBar, width: `${progress}%`, backgroundColor: color }} />
        </div>
    );
};

const styles = {
    container: {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '300px',
        zIndex: 1000,
    },
    notification: {
        backgroundColor: '#333',
        color: '#fff',
        padding: '10px 20px',
        borderRadius: '5px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
    },
    progressBar: {
        height: '5px',
        // backgroundColor will be set dynamically in the render method
        borderRadius: '5px',
        transition: 'width 1s linear',
    },
};

export default Notification;