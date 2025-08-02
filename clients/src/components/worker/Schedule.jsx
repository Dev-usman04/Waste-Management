import { useMemo } from 'react';
import { motion } from 'framer-motion';
import Card from '../common/Card.jsx';

const Schedule = ({ pickups = [] }) => {
  const weeklySchedule = useMemo(() => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const schedule = days.reduce((acc, day) => ({ ...acc, [day]: [] }), {});

    // Safety check before forEach
    if (Array.isArray(pickups)) {
      pickups.forEach((pickup) => {
        const date = new Date(pickup.dateTime);
        const dayName = days[date.getDay()];
        schedule[dayName].push(pickup);
      });
    }

    return schedule;
  }, [pickups]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {Object.entries(weeklySchedule).map(([day, dayPickups]) => (
        <Card key={day}>
          <h3 className="text-lg font-semibold text-slate-700">{day}</h3>
          {dayPickups.length === 0 ? (
            <p className="text-slate-600">No pickups scheduled</p>
          ) : (
            <ul className="space-y-2">
              {dayPickups.map((pickup) => (
                <li key={pickup._id || `${pickup.address}-${pickup.dateTime}`} className="text-slate-600">
                  <p><strong>Address:</strong> {pickup.address}</p>
                  <p><strong>Type:</strong> {pickup.pickupType}</p>
                  <p><strong>Time:</strong> {new Date(pickup.dateTime).toLocaleTimeString()}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      ))}
    </motion.div>
  );
};

export default Schedule;
