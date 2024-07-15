const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  
  const daysOfWeek = [0, 3, 5]; // 0: Sunday, 3: Wednesday, 5: Friday
  
  function getDaysInYear(year) {
    const days = [];
    for (let month = 0; month < 12; month++) {
      let date = new Date(year, month, 1);
      while (date.getMonth() === month) {
        if (daysOfWeek.includes(date.getDay())) {
          days.push(new Date(date));
        }
        date.setDate(date.getDate() + 1);
      }
    }
    return days;
  }
  
  function formatNumber(number) {
    return number < 10 ? '0' + number : number;
  }
  
  function formatDays(days) {
    const result = [];
    let currentMonth = -1;
    days.forEach(date => {
      if (date.getMonth() !== currentMonth) {
        currentMonth = date.getMonth();
        result.push(`//${monthNames[currentMonth]}`);
      }
      const day = formatNumber(date.getDate());
      const month = formatNumber(date.getMonth() + 1);
      result.push(`${day}/${month}/${date.getFullYear()}`);
    });
    return result;
  }
  
  function countDaysPerMonth(days) {
    const counts = Array(12).fill(0);
    days.forEach(date => {
      counts[date.getMonth()]++;
    });
    return counts.map((count, index) => `${monthNames[index]}: ${count}`);
  }
  
  const year = 2017;
  const days = getDaysInYear(year);
  const formattedDays = formatDays(days);
  const dayCounts = countDaysPerMonth(days);
  
  console.log(formattedDays.join('\n'));
  console.log('\n');
  console.log(dayCounts.join('\n'));
  