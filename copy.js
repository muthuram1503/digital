"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import MonthSelection from "../_components/MonthSelection";
import Gradeselect from "../_components/Gradeselect";
import DeptSelect from "../_components/DeptSelect";
import { Button } from "@/components/ui/button";
import axios from "axios";
import moment from "moment";

function Dashboard() {
  const { setTheme } = useTheme();

 
  const [attendanceData, setAttendance] = useState([]);
  const [stats, setStats] = useState({ total: 0, present: 0, absent: 0 });
  const [showPercentage, setShowPercentage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [SelectedMonth, SetSelectedMonth] = useState(null);
  const [SelectedGrade, SetSelectedGrade] = useState("");
  const [SelectedDept, SetSelectedDept] = useState("");
  
  const [updatedAttendance, setUpdatedAttendance] = useState({});
  const [daysInMonth, setDaysInMonth] = useState(0);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
 

  const getDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };




  useEffect(() => {
    setTheme("light");
  }, []);

//   const handleGetPercentage = async () => {
//     if (!selectedMonth || !selectedGrade || !selectedDept) return;
// console.log("hi")
//     setLoading(true);
//     setError("");
//     setShowPercentage(false);
//     setAttendance([]);

//     try {
//       console.log("hi")

//       // const studentsRes = await axios.get("http://localhost:5000/api/students/list", {
//       //   grade: selectedGrade,
//       //   dept: selectedDept,
//       // });
// //       const studentsRes = await axios.get("http://localhost:5000/api/students/list", {
// //   params: {
// //     grade: selectedGrade,
// //     dept: selectedDept,
// //   }
// // });






//       const students = studentsRes.data;

//      const attendanceRes = await axios.post("http://localhost:5000/api/attendance/view", {
//   month: selectedMonth,
//   year: "2025",
//   grade: selectedGrade,
// });

//       const attendanceRecords = attendanceRes.data;

//       const attendanceMap = {};
//       attendanceRecords.forEach((record) => {
//         if (!attendanceMap[record.RegNo]) {
//           attendanceMap[record.RegNo] = [];
//         }
//         attendanceMap[record.RegNo].push(record);
//       });

//       const mapped = [];
//       let presentCount = 0;
//       let absentCount = 0;

//       students.forEach((student) => {
//         const records = attendanceMap[student.RegNo] || [];
//         const isPresent = records.some((r) => r.present);
//         if (isPresent) presentCount++;
//         else absentCount++;

//         records.forEach((record) => {
//           mapped.push({
//             _id: `${student._id}-${record.date}`,
//             name: student.name,
//             regNo: student.RegNo,
//             dept: student.dept,
//             date: record.date,
//             present: record.present,
//           });
//         });
//       });

//       setAttendance(mapped);
//       setStats({ total: students.length, present: presentCount, absent: absentCount });
//       setShowPercentage(true);
//     } catch (err) {
//       console.error("Error fetching attendance:", err);
//       setError("Failed to fetch attendance data.");
//     } finally {
//       setLoading(false);
//     }
//   };

// original 



  const handleGetPercentage = async () => {
    if (!SelectedMonth || !SelectedGrade) return;

    // try {
    //   const res = await axios.post(
    //     "http://localhost:5000/api/attendance/view",
    //     {
    //       month: selectedMonth, // Number: 1-12
    //       year: "2025", // or dynamically get year
    //       grade: selectedGrade, // Must be same as student.year in DB
    //     }
    //   );
    const selectedMonth = moment(SelectedMonth).format("MM");
    const selectedYear = moment(SelectedMonth).format("YYYY");

    setMonth(selectedMonth);
    setYear(selectedYear);

    const totalDays = getDaysInMonth(selectedMonth, selectedYear);
    setDaysInMonth(totalDays);
      // const responseData = res.data;
      // console.log( responseData);


console.log(selectedMonth,selectedYear,SelectedGrade,SelectedDept)
      
    try {
      const res = await fetch("http://localhost:5000/api/attendance/view", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          month: selectedMonth,
          year: selectedYear,
          grade: SelectedGrade,
          dept: SelectedDept,
        }),
      });
      // const responseData = res.data;

      
      const data = await res.json();
     const  responseData=data;
console.log(data)
      const mapped = responseData.map((student) => {
        const attendanceObj = {
          name: student.name,
          regNo: student.RegNo,
          dept: student.dept,
        };

        student.attendanceRecords.forEach((record) => {
          console.log(record.date)
          const date = new Date(record.date);
          const day = date.getDate(); // Day from 1-31
          attendanceObj[day] = record.present;
        });

        // console.log(record.date);

        return attendanceObj;
        
      });








      setAttendance(mapped);
      console.log(mapped)
     setStats({ total: students.length, present: presentCount, absent: absentCount });

    } catch (err) {
      console.error("Error fetching attendance:", err);
    }
  };




const presentPercentage =
  stats.total && stats.present + stats.absent
    ? ((stats.present / (stats.present + stats.absent)) * 100).toFixed(2)
    : 0;

const absentPercentage =
  stats.total && stats.present + stats.absent
    ? ((stats.absent / (stats.present + stats.absent)) * 100).toFixed(2)
    : 0;



  return (
    <div className="p-10 min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <div className="flex flex-wrap gap-4">
          <MonthSelection onChange={SetSelectedMonth} />
          <Gradeselect onChange={SetSelectedGrade} />
          <DeptSelect onChange={SetSelectedDept} />
          <Button
            onClick={handleGetPercentage}
            className="bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Get Percentage
          </Button>
        </div>
      </div>

      {loading && <p className="text-blue-600">Loading attendance data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && (
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <h3 className="text-xl font-semibold text-gray-800">Statistics</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-100 rounded-lg">
              <h4 className="text-lg font-medium">Total Students</h4>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>

            {showPercentage && (
              <>
                <div className="p-4 bg-green-100 rounded-lg">
                  <h4 className="text-lg font-medium">Attendance %</h4>
                  <p className="text-2xl font-bold text-green-700">
                    {presentPercentage}%
                  </p>
                </div>

                <div className="p-4 bg-red-100 rounded-lg">
                  <h4 className="text-lg font-medium">Absent %</h4>
                  <p className="text-2xl font-bold text-red-700">
                    {absentPercentage}%
                  </p>
                </div>
              </>
            )}
          </div>

          {attendanceData.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold mt-6 mb-2">
                Attendance Records
              </h4>
              <ul className="list-disc list-inside max-h-64 overflow-y-auto">
                {attendanceData.map((record) => (
                  <li key={record._id}>
                    {record.date ? new Date(record.date).toDateString() : "Invalid Date"} - {" "}
                    <span
                      className={
                        record.present ? "text-green-600" : "text-red-600"
                      }
                    >
                      {record.present ? "Present" : "Absent"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;

//last copy and paste
// "use client";

// import React, { useEffect, useState } from "react";
// import { useTheme } from "next-themes";
// import MonthSelection from "../_components/MonthSelection";
// import Gradeselect from "../_components/Gradeselect";
// import DeptSelect from "../_components/DeptSelect"; // Add this component
// import { Button } from "@/components/ui/button";
// import axios from "axios";

// function Dashboard() {
//   const { setTheme } = useTheme();

//   const [selectedMonth, setSelectedMonth] = useState(null);
//   const [selectedGrade, setSelectedGrade] = useState(null);
//   const [selectedDept, setSelectedDept] = useState(null);
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [stats, setStats] = useState({ total: 0, present: 0, absent: 0 });
//   const [showPercentage, setShowPercentage] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     setTheme("light");
//   }, []);

//   const handleGetPercentage = async () => {
//     if (!selectedGrade || !selectedMonth || !selectedDept) {
//       setError("Please select grade, month, and department.");
//       return;
//     }

//     setLoading(true);
//     setError("");
//     setShowPercentage(false);

//     try {
//       const res = await axios.get(`/attendance/${selectedGrade}`);
//       const data = res.data.attendance || res.data;

//       if (!data || !Array.isArray(data)) {
//         setError("No attendance data found.");
//         setLoading(false);
//         return;
//       }

//       const filtered = data.filter((record) => {
//         const recordDate = new Date(record.date);
//         const selected = new Date(selectedMonth);
//         return (
//           recordDate.getMonth() === selected.getMonth() &&
//           recordDate.getFullYear() === selected.getFullYear() &&
//           record.department === selectedDept
//         );
//       });

//       const studentsMap = {};
//       filtered.forEach((record) => {
//         if (!studentsMap[record.studentId]) {
//           studentsMap[record.studentId] = [];
//         }
//         studentsMap[record.studentId].push(record);
//       });

//       const totalStudents = Object.keys(studentsMap).length;
//       let presentCount = 0;
//       let absentCount = 0;

//       Object.values(studentsMap).forEach((records) => {
//         records.forEach((r) => {
//           r.present ? presentCount++ : absentCount++;
//         });
//       });

//       setStats({
//         total: totalStudents,
//         present: presentCount,
//         absent: absentCount,
//       });

//       setAttendanceData(filtered);
//       setShowPercentage(true);
//     } catch (err) {
//       console.error(err);
//       setError("Error fetching data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const presentPercentage = stats.total
//     ? ((stats.present / (stats.present + stats.absent)) * 100).toFixed(2)
//     : 0;
//   const absentPercentage = stats.total
//     ? ((stats.absent / (stats.present + stats.absent)) * 100).toFixed(2)
//     : 0;

//   return (
//     <div className="p-10 min-h-screen bg-gray-50">
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
//         <h2 className="text-3xl font-bold">Dashboard</h2>
//         <div className="flex flex-wrap gap-4">
//           <MonthSelection onChange={setSelectedMonth} />
//           <Gradeselect onChange={setSelectedGrade} />
//           <DeptSelect onChange={setSelectedDept} />
//           <Button onClick={handleGetPercentage} className="bg-indigo-600 text-white hover:bg-indigo-700">
//             Get Percentage
//           </Button>
//         </div>
//       </div>

//       {loading && <p className="text-blue-600">Loading attendance data...</p>}
//       {error && <p className="text-red-500">{error}</p>}

//       {!loading && (
//         <div className="bg-white rounded-lg shadow p-6 space-y-4">
//           <h3 className="text-xl font-semibold text-gray-800">Statistics</h3>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="p-4 bg-blue-100 rounded-lg">
//               <h4 className="text-lg font-medium">Total Students</h4>
//               <p className="text-2xl font-bold">{stats.total}</p>
//             </div>

//             {showPercentage && (
//               <>
//                 <div className="p-4 bg-green-100 rounded-lg">
//                   <h4 className="text-lg font-medium">Attendance %</h4>
//                   <p className="text-2xl font-bold text-green-700">
//                     {presentPercentage}%
//                   </p>
//                 </div>
//                 <div className="p-4 bg-red-100 rounded-lg">
//                   <h4 className="text-lg font-medium">Absent %</h4>
//                   <p className="text-2xl font-bold text-red-700">
//                     {absentPercentage}%
//                   </p>
//                 </div>
//               </>
//             )}
//           </div>

//           {attendanceData.length > 0 && (
//             <div>
//               <h4 className="text-lg font-semibold mt-6 mb-2">Attendance Records</h4>
//               <ul className="list-disc list-inside max-h-64 overflow-y-auto">
//                 {attendanceData.map((record) => (
//                   <li key={record._id}>
//                     {new Date(record.date).toDateString()} -{" "}
//                     <span
//                       className={
//                         record.present ? "text-green-600" : "text-red-600"
//                       }
//                     >
//                       {record.present ? "Present" : "Absent"}
//                     </span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// export default Dashboard;