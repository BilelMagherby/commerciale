import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { 
  Search, Plus, Download, Filter, ChevronLeft, ChevronRight, 
  Calendar, DollarSign, Clock, FileText, MessageSquare, X,
  Edit, Eye, Download as DownloadIcon, Upload, CheckCircle,
  AlertCircle, Clock as ClockIcon, Briefcase, User,
  ArrowLeft, ArrowRight, User as UserIcon, Check, Wallet, Trash2
} from "lucide-react";

export default function RH() {
  const { employees, setEmployees } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState("calendar");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("fullName");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedDate, setSelectedDate] = useState(null);
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState("");
  const [attendanceForm, setAttendanceForm] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [newEmployeeModalOpen, setNewEmployeeModalOpen] = useState(false);
  const [editEmployeeModalOpen, setEditEmployeeModalOpen] = useState(false);
  const [editEmployeeTab, setEditEmployeeTab] = useState("general");
  const [editEmployee, setEditEmployee] = useState(null);
  const [editEmployeeForm, setEditEmployeeForm] = useState({});
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileEmployee, setProfileEmployee] = useState(null);
  const [profileCalendarDate, setProfileCalendarDate] = useState(null);
  const [profileAttendanceModalOpen, setProfileAttendanceModalOpen] = useState(false);
  const [selectedAttendanceStatus, setSelectedAttendanceStatus] = useState("");
  const [lateTime, setLateTime] = useState("");
  const [advanceAmount, setAdvanceAmount] = useState("");
  const [profileCalendarMonth, setProfileCalendarMonth] = useState(new Date(2026, 4, 1));
  const [salaryModalOpen, setSalaryModalOpen] = useState(false);
  const [salaryEmployee, setSalaryEmployee] = useState(null);
  const [currentSalaryMonth, setCurrentSalaryMonth] = useState(new Date());
  const [paymentNote, setPaymentNote] = useState("");
  const [paymentHistoryModalOpen, setPaymentHistoryModalOpen] = useState(false);
  const [paymentHistoryEmployee, setPaymentHistoryEmployee] = useState(null);
  const [newEmployeeForm, setNewEmployeeForm] = useState({
    fullName: "",
    position: "",
    department: "",
    phone: "",
    email: "",
    monthlySalary: "",
    status: "Active",
    payDay: "1"
  });

  const itemsPerPage = 8;

  // Filter and sort employees
  const filteredEmployees = employees
    .filter(emp => 
      emp.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      Active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      Inactive: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
      Vacation: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      Suspended: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${styles[status] || styles.Inactive}`}>
        {status}
      </span>
    );
  };

  const getAttendanceColor = (status) => {
    const colors = {
      Present: "bg-emerald-500",
      Absent: "bg-red-500",
      Late: "bg-orange-500",
      Vacation: "bg-blue-500",
      Advance: "bg-purple-500",
      "No Record": "bg-gray-300"
    };
    return colors[status] || colors["No Record"];
  };

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setAttendanceModalOpen(true);
    setAttendanceStatus("");
    setAttendanceForm({});
  };

  const handleAttendanceSubmit = () => {
    if (!selectedEmployee || !selectedDate) return;

    const updatedEmployees = employees.map(emp => {
      if (emp.id === selectedEmployee.id) {
        const dateKey = selectedDate.toISOString().split('T')[0];
        const updatedAttendance = {
          ...emp.attendance,
          [dateKey]: {
            status: attendanceStatus,
            ...attendanceForm
          }
        };
        return { ...emp, attendance: updatedAttendance };
      }
      return emp;
    });

    setEmployees(updatedEmployees);
    setSelectedEmployee(updatedEmployees.find(e => e.id === selectedEmployee.id));
    setAttendanceModalOpen(false);
  };

  const handleEditEmployee = () => {
    if (!editEmployee) return;

    const updatedEmployees = employees.map(emp => {
      if (emp.id === editEmployee.id) {
        return {
          ...emp,
          ...editEmployeeForm
        };
      }
      return emp;
    });

    setEmployees(updatedEmployees);
    setEditEmployeeModalOpen(false);
    setEditEmployeeTab("general");
    setEditEmployeeForm({});
    setEditEmployee(null);
  };

  const handleAddEmployee = () => {
    const newEmployee = {
      id: `EMP-${String(employees.length + 1).padStart(3, '0')}`,
      ...newEmployeeForm,
      monthlySalary: parseFloat(newEmployeeForm.monthlySalary),
      photo: `https://ui-avatars.com/api/?name=${encodeURIComponent(newEmployeeForm.fullName)}&background=random`,
      joinDate: new Date().toISOString().split('T')[0],
      attendance: {}
    };

    setEmployees([...employees, newEmployee]);
    setNewEmployeeModalOpen(false);
    setNewEmployeeForm({
      fullName: "",
      position: "",
      department: "",
      phone: "",
      email: "",
      monthlySalary: "",
      status: "Active",
      payDay: "1"
    });
  };

  const calculateProfileSalary = () => {
    if (!profileEmployee) return null;

    const baseSalary = profileEmployee.monthlySalary || 0;
    const dailyRate = baseSalary / 26;
    let totalDeductions = 0;
    let totalAdditions = 0;
    let presentDays = 0;
    let lateDays = 0;
    let advanceAmount = 0;

    // Calculate attendance for the current calendar month
    const year = profileCalendarMonth.getFullYear();
    const month = profileCalendarMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const attendance = profileEmployee.attendance?.[dateKey];
      
      if (attendance) {
        switch (attendance.status) {
          case 'Présent':
            presentDays++;
            break;
          case 'Retard':
            lateDays++;
            totalDeductions += dailyRate * 0.5; // 50% deduction
            break;
          case 'Absent':
            totalDeductions += dailyRate; // 100% deduction
            break;
          case 'Avances sur salaire':
            if (attendance.amount) {
              advanceAmount += attendance.amount;
              totalDeductions += attendance.amount;
            }
            break;
        }
      }
    }

    const netSalary = baseSalary - totalDeductions + totalAdditions;

    return {
      baseSalary,
      dailyRate,
      presentDays,
      lateDays,
      totalDeductions,
      totalAdditions,
      advanceAmount,
      netSalary
    };
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDay = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const days = [];
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12 bg-white dark:bg-gray-900" />);
    }

    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(year, month, day);
      const dateKey = date.toISOString().split('T')[0];
      const attendance = selectedEmployee?.attendance?.[dateKey];
      const status = attendance?.status || "No Record";

      days.push(
        <button
          key={day}
          onClick={() => handleDayClick(date)}
          className={`h-12 flex items-center justify-center text-sm font-medium transition-all hover:scale-105 hover:shadow-md cursor-pointer relative
            ${getAttendanceColor(status)} text-white`}
          title={`${status} - ${dateKey}`}
        >
          {day}
          {status !== "No Record" && (
            <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-white/80" />
          )}
        </button>
      );
    }

    return days;
  };

  const calculateSalary = () => {
    if (!selectedEmployee) return null;

    const baseSalary = selectedEmployee.monthlySalary;
    let bonuses = 0;
    let overtime = 0;
    let advances = 0;
    let absenceDeductions = 0;
    let lateDeductions = 0;

    if (selectedEmployee.attendance) {
      Object.values(selectedEmployee.attendance).forEach(record => {
        if (record.status === "Advance") {
          advances += parseFloat(record.amount) || 0;
        }
        if (record.status === "Absent" && record.type === "Unjustified") {
          absenceDeductions += baseSalary / 22;
        }
        if (record.status === "Late") {
          const minutesLate = parseFloat(record.minutesLate) || 0;
          lateDeductions += (minutesLate / 60) * (baseSalary / 176);
        }
      });
    }

    const netSalary = baseSalary + bonuses + overtime - advances - absenceDeductions - lateDeductions;

    return {
      baseSalary,
      bonuses,
      overtime,
      advances,
      absenceDeductions,
      lateDeductions,
      netSalary
    };
  };

  const renderAttendanceForm = () => {
    switch (attendanceStatus) {
      case "Present":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Check In Time</label>
              <input
                type="time"
                value={attendanceForm.checkIn || ""}
                onChange={(e) => setAttendanceForm({...attendanceForm, checkIn: e.target.value})}
                className="w-full p-2 border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Check Out Time</label>
              <input
                type="time"
                value={attendanceForm.checkOut || ""}
                onChange={(e) => setAttendanceForm({...attendanceForm, checkOut: e.target.value})}
                className="w-full p-2 border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Overtime Hours</label>
              <input
                type="number"
                value={attendanceForm.overtime || ""}
                onChange={(e) => setAttendanceForm({...attendanceForm, overtime: e.target.value})}
                className="w-full p-2 border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea
                value={attendanceForm.notes || ""}
                onChange={(e) => setAttendanceForm({...attendanceForm, notes: e.target.value})}
                className="w-full p-2 border border-border rounded-lg resize-none"
                rows="2"
              />
            </div>
          </div>
        );
      case "Absent":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="Justified"
                    checked={attendanceForm.type === "Justified"}
                    onChange={(e) => setAttendanceForm({...attendanceForm, type: e.target.value})}
                  />
                  Justified
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="Unjustified"
                    checked={attendanceForm.type === "Unjustified"}
                    onChange={(e) => setAttendanceForm({...attendanceForm, type: e.target.value})}
                  />
                  Unjustified
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Reason</label>
              <textarea
                value={attendanceForm.reason || ""}
                onChange={(e) => setAttendanceForm({...attendanceForm, reason: e.target.value})}
                className="w-full p-2 border border-border rounded-lg resize-none"
                rows="2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Attachment</label>
              <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
              </div>
            </div>
          </div>
        );
      case "Late":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Arrival Time</label>
              <input
                type="time"
                value={attendanceForm.arrivalTime || ""}
                onChange={(e) => setAttendanceForm({...attendanceForm, arrivalTime: e.target.value})}
                className="w-full p-2 border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Minutes Late</label>
              <input
                type="number"
                value={attendanceForm.minutesLate || ""}
                onChange={(e) => setAttendanceForm({...attendanceForm, minutesLate: e.target.value})}
                className="w-full p-2 border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Reason</label>
              <textarea
                value={attendanceForm.reason || ""}
                onChange={(e) => setAttendanceForm({...attendanceForm, reason: e.target.value})}
                className="w-full p-2 border border-border rounded-lg resize-none"
                rows="2"
              />
            </div>
          </div>
        );
      case "Vacation":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Vacation Type</label>
              <select
                value={attendanceForm.vacationType || ""}
                onChange={(e) => setAttendanceForm({...attendanceForm, vacationType: e.target.value})}
                className="w-full p-2 border border-border rounded-lg"
              >
                <option value="">Select type</option>
                <option value="Annual">Annual</option>
                <option value="Medical">Medical</option>
                <option value="Exceptional">Exceptional</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input
                type="date"
                value={attendanceForm.startDate || ""}
                onChange={(e) => setAttendanceForm({...attendanceForm, startDate: e.target.value})}
                className="w-full p-2 border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                type="date"
                value={attendanceForm.endDate || ""}
                onChange={(e) => setAttendanceForm({...attendanceForm, endDate: e.target.value})}
                className="w-full p-2 border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea
                value={attendanceForm.notes || ""}
                onChange={(e) => setAttendanceForm({...attendanceForm, notes: e.target.value})}
                className="w-full p-2 border border-border rounded-lg resize-none"
                rows="2"
              />
            </div>
          </div>
        );
      case "Advance":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Amount (DT)</label>
              <input
                type="number"
                value={attendanceForm.amount || ""}
                onChange={(e) => setAttendanceForm({...attendanceForm, amount: e.target.value})}
                className="w-full p-2 border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Reason</label>
              <textarea
                value={attendanceForm.reason || ""}
                onChange={(e) => setAttendanceForm({...attendanceForm, reason: e.target.value})}
                className="w-full p-2 border border-border rounded-lg resize-none"
                rows="2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                value={attendanceForm.date || selectedDate?.toISOString().split('T')[0] || ""}
                onChange={(e) => setAttendanceForm({...attendanceForm, date: e.target.value})}
                className="w-full p-2 border border-border rounded-lg"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-3xl tracking-tight text-foreground m-0">
            Human Resources
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage employees, attendance, salaries and advances.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              const csvContent = [
                ['ID', 'Nom', 'Poste', 'Département', 'Téléphone', 'Email', 'Salaire', 'Statut'].join(','),
                ...employees.map(emp => [
                  emp.id,
                  emp.fullName,
                  emp.position,
                  emp.department,
                  emp.phone,
                  emp.email,
                  emp.monthlySalary,
                  emp.status
                ].join(','))
              ].join('\n');
              
              const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
              const link = document.createElement('a');
              link.href = URL.createObjectURL(blob);
              link.download = 'employees.csv';
              link.click();
            }}
            className="inline-flex items-center space-x-2 bg-secondary hover:bg-secondary/80 text-foreground font-semibold text-sm px-4 py-2.5 rounded-xl border border-border transition-all"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          <button 
            onClick={() => setNewEmployeeModalOpen(true)}
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-md shadow-blue-600/10 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>New Employee</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search employees..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-input border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Employee Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => handleSort('photo')}>
                  Photo
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => handleSort('id')}>
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => handleSort('fullName')}>
                  Full Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => handleSort('position')}>
                  Position
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => handleSort('department')}>
                  Department
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => handleSort('phone')}>
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => handleSort('monthlySalary')}>
                  Monthly Salary
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => handleSort('status')}>
                  Status
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedEmployees.map((employee) => (
                <tr 
                  key={employee.id} 
                  className="hover:bg-secondary/30 transition-colors cursor-pointer"
                  onClick={() => setSelectedEmployee(employee)}
                >
                  <td className="px-4 py-3">
                    <img
                      src={employee.photo}
                      alt={employee.fullName}
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-border"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">{employee.id}</td>
                  <td className="px-4 py-3 text-sm font-medium">{employee.fullName}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{employee.position}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{employee.department}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{employee.phone}</td>
                  <td className="px-4 py-3 text-sm font-semibold">{employee.monthlySalary.toLocaleString()} DT</td>
                  <td className="px-4 py-3">{getStatusBadge(employee.status)}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setProfileEmployee(employee);
                          setProfileModalOpen(true);
                        }}
                        className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        title="View Profile"
                      >
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSalaryEmployee(employee);
                          setSalaryModalOpen(true);
                        }}
                        className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        title="Mark as Present"
                      >
                        <Check className="h-4 w-4 text-emerald-600" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPaymentHistoryEmployee(employee);
                          setPaymentHistoryModalOpen(true);
                        }}
                        className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        title="Salary"
                      >
                        <Wallet className="h-4 w-4 text-blue-600" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditEmployee(employee);
                          setEditEmployeeForm({});
                          setEditEmployeeTab("general");
                          setEditEmployeeModalOpen(true);
                        }}
                        className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4 text-orange-600" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Êtes-vous sûr de vouloir supprimer ${employee.fullName} ?`)) {
                            setEmployees(employees.filter(emp => emp.id !== employee.id));
                          }
                        }}
                        className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 bg-secondary/30 border-t border-border">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredEmployees.length)} of {filteredEmployees.length} employees
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 hover:bg-secondary rounded-lg transition-colors disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 hover:bg-secondary rounded-lg transition-colors disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Sidebar Drawer */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div 
            className="fixed inset-0 bg-black/50"
            onClick={() => setSelectedEmployee(null)}
          />
          <div className="relative w-[450px] h-full bg-card shadow-2xl overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-card border-b border-border p-6 z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedEmployee.photo}
                    alt={selectedEmployee.fullName}
                    className="h-16 w-16 rounded-full object-cover ring-2 ring-border"
                  />
                  <div>
                    <h2 className="text-xl font-bold">{selectedEmployee.fullName}</h2>
                    <p className="text-sm text-muted-foreground">{selectedEmployee.position}</p>
                    <p className="text-xs text-muted-foreground">{selectedEmployee.department}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEmployee(null)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">ID:</span>
                  <span className="ml-1 font-medium">{selectedEmployee.id}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="ml-1 font-medium">{selectedEmployee.phone}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Salary:</span>
                  <span className="ml-1 font-medium">{selectedEmployee.monthlySalary.toLocaleString()} DT</span>
                </div>
              </div>
              <div className="mt-3">
                {getStatusBadge(selectedEmployee.status)}
              </div>
              <div className="flex gap-2 mt-4">
                <button className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors text-sm">
                  <Edit className="h-4 w-4 inline mr-2" />
                  Edit Employee
                </button>
                <button
                  onClick={() => setSelectedEmployee(null)}
                  className="flex-1 py-2 bg-secondary hover:bg-secondary/80 text-foreground font-semibold rounded-lg transition-colors text-sm"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-border sticky top-[280px] bg-card z-10">
              <div className="flex">
                {[
                  { id: 'calendar', label: 'Calendar', icon: Calendar },
                  { id: 'salary', label: 'Salary', icon: DollarSign },
                  { id: 'history', label: 'History', icon: Clock },
                  { id: 'documents', label: 'Documents', icon: FileText },
                  { id: 'notes', label: 'Notes', icon: MessageSquare }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-3 px-4 text-sm font-medium transition-colors border-b-2
                      ${activeTab === tab.id 
                        ? 'border-blue-600 text-blue-600' 
                        : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                  >
                    <tab.icon className="h-4 w-4 inline mr-2" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'calendar' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                      className="p-2 hover:bg-secondary rounded-lg transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <h3 className="text-xl font-bold text-foreground">
                      {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h3>
                    <button
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                      className="p-2 hover:bg-secondary rounded-lg transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                  
                  {/* Calendar Grid */}
                  <div className="bg-white dark:bg-gray-900 rounded-xl border border-border overflow-hidden shadow-sm">
                    {/* Day Headers */}
                    <div className="grid grid-cols-7 border-b border-border">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          {day}
                        </div>
                      ))}
                    </div>
                    
                    {/* Calendar Days */}
                    <div className="grid grid-cols-7 gap-px bg-border">
                      {renderCalendar()}
                    </div>
                  </div>
                  
                  {/* Legend */}
                  <div className="flex flex-wrap gap-4 text-xs">
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded bg-emerald-500"></span>
                      <span className="text-muted-foreground">Present</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded bg-red-500"></span>
                      <span className="text-muted-foreground">Absent</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded bg-orange-500"></span>
                      <span className="text-muted-foreground">Late</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded bg-blue-500"></span>
                      <span className="text-muted-foreground">Vacation</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded bg-purple-500"></span>
                      <span className="text-muted-foreground">Advance</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded bg-gray-300"></span>
                      <span className="text-muted-foreground">No Record</span>
                    </span>
                  </div>
                </div>
              )}

              {activeTab === 'salary' && (
                <div className="space-y-4">
                  {(() => {
                    const salary = calculateSalary();
                    if (!salary) return null;
                    return (
                      <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-secondary/30 p-4 rounded-xl">
                        <div className="text-sm text-muted-foreground mb-1">Base Salary</div>
                        <div className="text-2xl font-bold">{salary.baseSalary.toLocaleString()} DT</div>
                      </div>
                      <div className="bg-emerald-500/10 p-4 rounded-xl">
                        <div className="text-sm text-muted-foreground mb-1">Bonuses</div>
                        <div className="text-2xl font-bold text-emerald-600">+{salary.bonuses.toLocaleString()} DT</div>
                      </div>
                      <div className="bg-emerald-500/10 p-4 rounded-xl">
                        <div className="text-sm text-muted-foreground mb-1">Overtime</div>
                        <div className="text-2xl font-bold text-emerald-600">+{salary.overtime.toLocaleString()} DT</div>
                      </div>
                      <div className="bg-red-500/10 p-4 rounded-xl">
                        <div className="text-sm text-muted-foreground mb-1">Advances</div>
                        <div className="text-2xl font-bold text-red-600">-{salary.advances.toLocaleString()} DT</div>
                      </div>
                      <div className="bg-red-500/10 p-4 rounded-xl">
                        <div className="text-sm text-muted-foreground mb-1">Absence</div>
                        <div className="text-2xl font-bold text-red-600">-{salary.absenceDeductions.toLocaleString()} DT</div>
                      </div>
                      <div className="bg-red-500/10 p-4 rounded-xl">
                        <div className="text-sm text-muted-foreground mb-1">Late</div>
                        <div className="text-2xl font-bold text-red-600">-{salary.lateDeductions.toLocaleString()} DT</div>
                      </div>
                    </div>
                    <div className="bg-blue-600 text-white p-6 rounded-xl">
                      <div className="text-sm opacity-80 mb-1">Net Salary</div>
                      <div className="text-3xl font-bold">{salary.netSalary.toLocaleString()} DT</div>
                    </div>
                    </>
                  );
                  })()}
                </div>
              )}

              {activeTab === 'history' && (
                <div className="space-y-4">
                  <div className="relative pl-6 border-l-2 border-border">
                    {selectedEmployee.attendance && Object.entries(selectedEmployee.attendance).map(([date, record], index) => (
                      <div key={date} className="mb-6 relative">
                        <div className={`absolute -left-[31px] w-4 h-4 rounded-full border-2 border-background
                          ${record.status === 'Present' ? 'bg-emerald-500' : 
                            record.status === 'Absent' ? 'bg-red-500' :
                            record.status === 'Late' ? 'bg-orange-500' :
                            record.status === 'Vacation' ? 'bg-blue-500' :
                            record.status === 'Advance' ? 'bg-purple-500' : 'bg-gray-300'}
                        `} />
                        <div className="bg-secondary/30 p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold">{record.status}</span>
                            <span className="text-xs text-muted-foreground">{date}</span>
                          </div>
                          {record.reason && <p className="text-sm text-muted-foreground">{record.reason}</p>}
                          {record.amount && <p className="text-sm text-muted-foreground">Amount: {record.amount} DT</p>}
                        </div>
                      </div>
                    ))}
                    {(!selectedEmployee.attendance || Object.keys(selectedEmployee.attendance).length === 0) && (
                      <p className="text-muted-foreground text-sm">No history records found.</p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="space-y-4">
                  {selectedEmployee.documents && Object.entries(selectedEmployee.documents).map(([type, filename]) => (
                    <div key={type} className="bg-secondary/30 p-4 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium capitalize">{type}</div>
                          <div className="text-xs text-muted-foreground">{filename}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                          <DownloadIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="space-y-4">
                  <textarea
                    value={selectedEmployee.notes || ""}
                    onChange={(e) => {
                      const updatedEmployees = employees.map(emp => 
                        emp.id === selectedEmployee.id ? {...emp, notes: e.target.value} : emp
                      );
                      setEmployees(updatedEmployees);
                      setSelectedEmployee({...selectedEmployee, notes: e.target.value});
                    }}
                    className="w-full p-4 border border-border rounded-xl resize-none min-h-[200px]"
                    placeholder="Add notes about this employee..."
                  />
                  <button className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors">
                    Save Notes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Attendance Modal */}
      {attendanceModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div 
            className="fixed inset-0 bg-black/50"
            onClick={() => setAttendanceModalOpen(false)}
          />
          <div className="relative bg-card rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-semibold">Attendance Details</h3>
              <p className="text-sm text-muted-foreground">
                {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="p-6">
              {!attendanceStatus ? (
                <div className="grid grid-cols-2 gap-3">
                  {['Present', 'Absent', 'Late', 'Vacation', 'Advance'].map(status => (
                    <button
                      key={status}
                      onClick={() => setAttendanceStatus(status)}
                      className={`p-4 rounded-xl border-2 transition-all hover:scale-105
                        ${attendanceStatus === status ? 'border-blue-600 bg-blue-50' : 'border-border hover:border-blue-300'}`}
                    >
                      <div className={`w-8 h-8 rounded-full mx-auto mb-2 ${getAttendanceColor(status)}`} />
                      <span className="text-sm font-medium">{status}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <button
                      onClick={() => setAttendanceStatus("")}
                      className="text-sm text-blue-600 hover:text-blue-500"
                    >
                      ← Back to status selection
                    </button>
                  </div>
                  {renderAttendanceForm()}
                </>
              )}
            </div>
            {attendanceStatus && (
              <div className="p-6 border-t border-border flex gap-3">
                <button
                  onClick={() => setAttendanceModalOpen(false)}
                  className="flex-1 py-2 bg-secondary hover:bg-secondary/80 text-foreground font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAttendanceSubmit}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors"
                >
                  Save
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* New Employee Modal */}
      {newEmployeeModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div 
            className="fixed inset-0 bg-black/50"
            onClick={() => setNewEmployeeModalOpen(false)}
          />
          <div className="relative bg-card rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <h3 className="text-xl font-bold">Nouvel Employé</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nom complet</label>
                <input
                  type="text"
                  value={newEmployeeForm.fullName}
                  onChange={(e) => setNewEmployeeForm({...newEmployeeForm, fullName: e.target.value})}
                  className="w-full p-2 border border-border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Poste / Fonction</label>
                <input
                  type="text"
                  value={newEmployeeForm.position}
                  onChange={(e) => setNewEmployeeForm({...newEmployeeForm, position: e.target.value})}
                  className="w-full p-2 border border-border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Département / Service</label>
                <input
                  type="text"
                  value={newEmployeeForm.department}
                  onChange={(e) => setNewEmployeeForm({...newEmployeeForm, department: e.target.value})}
                  className="w-full p-2 border border-border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Téléphone</label>
                <input
                  type="text"
                  value={newEmployeeForm.phone}
                  onChange={(e) => setNewEmployeeForm({...newEmployeeForm, phone: e.target.value})}
                  className="w-full p-2 border border-border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={newEmployeeForm.email}
                  onChange={(e) => setNewEmployeeForm({...newEmployeeForm, email: e.target.value})}
                  className="w-full p-2 border border-border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Salaire de base (DT)</label>
                <input
                  type="number"
                  value={newEmployeeForm.monthlySalary}
                  onChange={(e) => setNewEmployeeForm({...newEmployeeForm, monthlySalary: e.target.value})}
                  className="w-full p-2 border border-border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Statut</label>
                <select
                  value={newEmployeeForm.status}
                  onChange={(e) => setNewEmployeeForm({...newEmployeeForm, status: e.target.value})}
                  className="w-full p-2 border border-border rounded-lg"
                >
                  <option value="Active">Actif</option>
                  <option value="Inactive">Inactif</option>
                  <option value="Vacation">Congé</option>
                  <option value="Suspended">Suspendu</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Jour de paie</label>
                <select
                  value={newEmployeeForm.payDay}
                  onChange={(e) => setNewEmployeeForm({...newEmployeeForm, payDay: e.target.value})}
                  className="w-full p-2 border border-border rounded-lg"
                >
                  {[1, 5, 10, 15, 20, 25].map(day => (
                    <option key={day} value={day}>{day} de chaque mois</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-border flex gap-3">
              <button
                onClick={() => setNewEmployeeModalOpen(false)}
                className="flex-1 py-2 bg-secondary hover:bg-secondary/80 text-foreground font-semibold rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleAddEmployee}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Employee Profile Modal */}
      {profileModalOpen && profileEmployee && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div 
            className="fixed inset-0 bg-black/50"
            onClick={() => setProfileModalOpen(false)}
          />
          <div className="relative bg-card rounded-xl shadow-2xl w-full max-w-4xl mx-4 overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                  {profileEmployee.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(profileEmployee.status)}
                    <h3 className="text-xl font-bold">Fiche Ouvrier</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{profileEmployee.fullName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    const content = `
Fiche Ouvrier - ${profileEmployee.fullName}
================================
Informations Personnelles
--------------------------
CIN: ${profileEmployee.cin || 'N/A'}
Téléphone: ${profileEmployee.phone || 'N/A'}
Date de Naissance: ${profileEmployee.dateOfBirth || 'N/A'}
Adresse: ${profileEmployee.address || 'N/A'}
Situation Familiale: ${profileEmployee.maritalStatus || 'N/A'}
Nombre d'enfants: ${profileEmployee.numberOfChildren || 0}

Informations Professionnelles
------------------------------
Département: ${profileEmployee.department || '-'}
Responsable: ${profileEmployee.manager || 'N/A'}
Date d'Embauche: ${profileEmployee.joinDate || 'N/A'}
Type de Contrat: ${profileEmployee.contractType || 'N/A'}

Salaire & Paiement
------------------
Salaire de base: ${profileEmployee.monthlySalary?.toLocaleString() || '0'} DT
Jour de paie: 1 de chaque mois
Banque: ${profileEmployee.bankName || 'N/A'}
RIB/IBAN: ${profileEmployee.rib || 'N/A'}

Administration
--------------
Fin de Contrat: ${profileEmployee.contractEnd || 'N/A'}
Régime Horaire: ${profileEmployee.workSchedule || 'N/A'}
Solde de Congés: ${profileEmployee.vacationBalance || 0} Jours
CNSS: ${profileEmployee.cnssNumber || 'N/A'}
Contact d'Urgence: ${profileEmployee.emergencyContact || 'N/A'}
                    `;
                    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = `fiche_${profileEmployee.fullName.replace(/\s+/g, '_')}.txt`;
                    link.click();
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors text-sm"
                >
                  Télécharger PDF
                </button>
                <button
                  onClick={() => setProfileModalOpen(false)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Salary Calculator */}
              <div className="bg-secondary/30 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4">Calculateur de Salaire — {profileCalendarMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</h4>
                {(() => {
                  const salary = calculateProfileSalary();
                  if (!salary) return null;
                  return (
                    <>
                      <div className="grid grid-cols-2 gap-6 mb-4">
                        <div>
                          <label className="text-xs text-muted-foreground">Salaire de Base</label>
                          <p className="font-semibold text-lg">{salary.baseSalary.toFixed(2)} DT</p>
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">Calcul Journalier (Division)</label>
                          <p className="font-semibold text-lg">{salary.dailyRate.toFixed(3)} DT / jour</p>
                          <p className="text-xs text-muted-foreground">(Divisé par 26 jours ouvrables)</p>
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">Détail Présence</label>
                          <p className="font-semibold text-lg">{salary.presentDays} Présent(s)</p>
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">Retards</label>
                          <p className="font-semibold text-lg text-orange-600">{salary.lateDays} jour(s)</p>
                          <p className="text-xs text-muted-foreground">Déduction 50%</p>
                        </div>
                      </div>
                      
                      {/* Deductions */}
                      {salary.totalDeductions > 0 && (
                        <div className="space-y-2 mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                          <p className="text-sm font-semibold text-red-600">Déductions</p>
                          {salary.lateDays > 0 && (
                            <div className="flex justify-between text-sm">
                              <span>Retards ({salary.lateDays} × {salary.dailyRate.toFixed(2)} × 50%)</span>
                              <span className="text-red-600">-{(salary.lateDays * salary.dailyRate * 0.5).toFixed(2)} DT</span>
                            </div>
                          )}
                          {salary.advanceAmount > 0 && (
                            <div className="flex justify-between text-sm">
                              <span>Avances sur salaire</span>
                              <span className="text-red-600">-{salary.advanceAmount.toFixed(2)} DT</span>
                            </div>
                          )}
                          <div className="flex justify-between text-sm font-semibold border-t border-red-200 pt-2">
                            <span>Total Déductions</span>
                            <span className="text-red-600">-{salary.totalDeductions.toFixed(2)} DT</span>
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="text-xs text-muted-foreground">Salaire Net à Payer</label>
                        <p className="font-bold text-xl text-blue-600">{salary.netSalary.toFixed(2)} DT</p>
                        <p className="text-xs text-muted-foreground">Toutes déductions & avances déduites</p>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Calendar */}
              <div className="bg-secondary/30 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold">Présence — Calendrier</h4>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setProfileCalendarMonth(new Date(profileCalendarMonth.getFullYear(), profileCalendarMonth.getMonth() - 1, 1))}
                      className="p-2 hover:bg-secondary rounded-lg transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <span className="font-semibold capitalize">
                      {profileCalendarMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                    </span>
                    <button 
                      onClick={() => setProfileCalendarMonth(new Date(profileCalendarMonth.getFullYear(), profileCalendarMonth.getMonth() + 1, 1))}
                      className="p-2 hover:bg-secondary rounded-lg transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                    <div key={day} className="text-center text-xs font-semibold text-muted-foreground py-2">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31].map(day => {
                    const isWeekend = (day + 2) % 7 === 0 || (day + 1) % 7 === 0;
                    const dateKey = `${profileCalendarMonth.getFullYear()}-${String(profileCalendarMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const attendance = profileEmployee.attendance?.[dateKey];
                    const status = attendance?.status;
                    
                    const getStatusColor = (status) => {
                      switch(status) {
                        case 'Présent': return 'bg-emerald-500 text-white';
                        case 'Absent': return 'bg-red-500 text-white';
                        case 'Congé': return 'bg-blue-500 text-white';
                        case 'Retard': return 'bg-orange-500 text-white';
                        case 'Avances sur salaire': return 'bg-purple-500 text-white';
                        default: return isWeekend ? 'bg-red-100 dark:bg-red-900/30 text-red-600' : 'bg-white dark:bg-gray-800';
                      }
                    };

                    return (
                      <button
                        key={day}
                        onClick={() => {
                          if (!isWeekend) {
                            setProfileCalendarDate(dateKey);
                            setProfileAttendanceModalOpen(true);
                          }
                        }}
                        disabled={isWeekend}
                        className={`h-10 flex items-center justify-center rounded-lg text-sm transition-colors hover:scale-105
                          ${getStatusColor(status)}
                          ${isWeekend ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        {day}
                        {isWeekend && <span className="ml-1 text-xs">OFF</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Interactive Attendance Buttons */}
              <div className="bg-secondary/30 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4">Marquer la présence</h4>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { status: 'Présent', color: 'bg-emerald-500', hoverColor: 'hover:bg-emerald-600' },
                    { status: 'Absent', color: 'bg-red-500', hoverColor: 'hover:bg-red-600' },
                    { status: 'Congé', color: 'bg-blue-500', hoverColor: 'hover:bg-blue-600' },
                    { status: 'Retard', color: 'bg-orange-500', hoverColor: 'hover:bg-orange-600' },
                    { status: 'Avances sur salaire', color: 'bg-purple-500', hoverColor: 'hover:bg-purple-600' }
                  ].map((option) => (
                    <button
                      key={option.status}
                      onClick={() => {
                        setProfileCalendarDate(`2026-05-${String(new Date().getDate()).padStart(2, '0')}`);
                        setSelectedAttendanceStatus(option.status);
                        if (option.status === 'Retard') {
                          setProfileAttendanceModalOpen(true);
                        } else if (option.status === 'Avances sur salaire') {
                          setProfileAttendanceModalOpen(true);
                        } else {
                          const updatedEmployees = employees.map(emp => {
                            if (emp.id === profileEmployee.id) {
                              const existingAttendance = emp.attendance || {};
                              return {
                                ...emp,
                                attendance: {
                                  ...existingAttendance,
                                  [`2026-05-${String(new Date().getDate()).padStart(2, '0')}`]: {
                                    status: option.status
                                  }
                                }
                              };
                            }
                            return emp;
                          });
                          setEmployees(updatedEmployees);
                          setProfileEmployee(updatedEmployees.find(e => e.id === profileEmployee.id));
                        }
                      }}
                      className={`${option.color} ${option.hoverColor} text-white p-3 rounded-lg font-semibold text-sm transition-all hover:scale-105`}
                    >
                      {option.status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Advances */}
              <div className="bg-secondary/30 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold">Avances sur salaire</h4>
                    <p className="text-sm text-muted-foreground">Débitées automatiquement du registre de caisse</p>
                  </div>
                  <button 
                    onClick={() => {
                      setProfileCalendarDate(`2026-05-${String(new Date().getDate()).padStart(2, '0')}`);
                      setSelectedAttendanceStatus('Avances sur salaire');
                      setProfileAttendanceModalOpen(true);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors text-sm"
                  >
                    Accorder une avance
                  </button>
                </div>
                <p className="text-sm text-muted-foreground">Aucune avance accordée à ce jour.</p>
              </div>

              {/* Personal Information */}
              <div>
                <h4 className="text-lg font-semibold mb-4 text-blue-600">Informations Personnelles</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground">CIN</label>
                    <p className="font-medium">{profileEmployee.cin || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Numéro de Téléphone</label>
                    <p className="font-medium">{profileEmployee.phone || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Date de Naissance</label>
                    <p className="font-medium">{profileEmployee.dateOfBirth || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Adresse</label>
                    <p className="font-medium">{profileEmployee.address || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Situation Familiale</label>
                    <p className="font-medium">{profileEmployee.maritalStatus || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Nombre d'enfants</label>
                    <p className="font-medium">{profileEmployee.numberOfChildren || 0}</p>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div>
                <h4 className="text-lg font-semibold mb-4 text-blue-600">Informations Professionnelles</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground">Département / Service</label>
                    <p className="font-medium">{profileEmployee.department || "-"}</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Responsable Hiérarchique</label>
                    <p className="font-medium">{profileEmployee.manager || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Date d'Embauche</label>
                    <p className="font-medium">{profileEmployee.joinDate || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Type de Contrat</label>
                    <p className="font-medium">{profileEmployee.contractType || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Salary & Payment */}
              <div>
                <h4 className="text-lg font-semibold mb-4 text-blue-600">Salaire & Paiement</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground">Salaire de base</label>
                    <p className="font-medium">{profileEmployee.monthlySalary?.toLocaleString() || "0"} DT</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Jour de paie (jour du mois)</label>
                    <p className="font-medium">1 de chaque mois</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Nom de la Banque</label>
                    <p className="font-medium">{profileEmployee.bankName || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">RIB / IBAN</label>
                    <p className="font-medium">{profileEmployee.rib || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Administration & Security & Control */}
              <div>
                <h4 className="text-lg font-semibold mb-4 text-blue-600">Administration & Sécurité & Contrôle</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground">Fin de Contrat</label>
                    <p className="font-medium">{profileEmployee.contractEnd || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Régime Horaire</label>
                    <p className="font-medium">{profileEmployee.workSchedule || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Solde de Congés (Jours)</label>
                    <p className="font-medium">{profileEmployee.vacationBalance || 0} Jours</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Numéro CNSS</label>
                    <p className="font-medium">{profileEmployee.cnssNumber || "N/A"}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-muted-foreground">Contact d'Urgence</label>
                    <p className="font-medium">{profileEmployee.emergencyContact || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Attendance Selection Modal */}
      {profileAttendanceModalOpen && profileEmployee && profileCalendarDate && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center">
          <div 
            className="fixed inset-0 bg-black/50"
            onClick={() => {
              setProfileAttendanceModalOpen(false);
              setSelectedAttendanceStatus("");
              setLateTime("");
            }}
          />
          <div className="relative bg-card rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-semibold">Marquer la présence</h3>
              <p className="text-sm text-muted-foreground">{profileCalendarDate}</p>
            </div>
            <div className="p-6">
              {!selectedAttendanceStatus ? (
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { status: 'Présent', color: 'bg-emerald-500', hoverColor: 'hover:bg-emerald-600' },
                    { status: 'Absent', color: 'bg-red-500', hoverColor: 'hover:bg-red-600' },
                    { status: 'Congé', color: 'bg-blue-500', hoverColor: 'hover:bg-blue-600' },
                    { status: 'Retard', color: 'bg-orange-500', hoverColor: 'hover:bg-orange-600' },
                    { status: 'Avances sur salaire', color: 'bg-purple-500', hoverColor: 'hover:bg-purple-600' }
                  ].map((option) => (
                    <button
                      key={option.status}
                      onClick={() => {
                        if (option.status === 'Retard') {
                          setSelectedAttendanceStatus(option.status);
                        } else if (option.status === 'Avances sur salaire') {
                          setSelectedAttendanceStatus(option.status);
                        } else {
                          const updatedEmployees = employees.map(emp => {
                            if (emp.id === profileEmployee.id) {
                              const existingAttendance = emp.attendance || {};
                              return {
                                ...emp,
                                attendance: {
                                  ...existingAttendance,
                                  [profileCalendarDate]: {
                                    status: option.status
                                  }
                                }
                              };
                            }
                            return emp;
                          });
                          setEmployees(updatedEmployees);
                          setProfileEmployee(updatedEmployees.find(e => e.id === profileEmployee.id));
                          setProfileAttendanceModalOpen(false);
                          setProfileCalendarDate(null);
                        }
                      }}
                      className={`${option.color} ${option.hoverColor} text-white p-4 rounded-xl font-semibold transition-all hover:scale-105`}
                    >
                      {option.status}
                    </button>
                  ))}
                </div>
              ) : selectedAttendanceStatus === 'Retard' ? (
                <div className="space-y-4">
                  <div>
                    <button
                      onClick={() => setSelectedAttendanceStatus("")}
                      className="text-sm text-blue-600 hover:text-blue-500"
                    >
                      ← Retour aux options
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Heure d'arrivée (Retard)</label>
                    <input
                      type="time"
                      value={lateTime}
                      onChange={(e) => setLateTime(e.target.value)}
                      className="w-full p-3 border border-border rounded-lg"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Entrez l'heure à laquelle l'employé est arrivé</p>
                  </div>
                  <button
                    onClick={() => {
                      const updatedEmployees = employees.map(emp => {
                        if (emp.id === profileEmployee.id) {
                          const existingAttendance = emp.attendance || {};
                          return {
                            ...emp,
                            attendance: {
                              ...existingAttendance,
                              [profileCalendarDate]: {
                                status: selectedAttendanceStatus,
                                time: lateTime
                              }
                            }
                          };
                        }
                        return emp;
                      });
                      setEmployees(updatedEmployees);
                      setProfileEmployee(updatedEmployees.find(e => e.id === profileEmployee.id));
                      setProfileAttendanceModalOpen(false);
                      setSelectedAttendanceStatus("");
                      setLateTime("");
                      setProfileCalendarDate(null);
                    }}
                    disabled={!lateTime}
                    className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirmer le retard
                  </button>
                </div>
              ) : selectedAttendanceStatus === 'Avances sur salaire' ? (
                <div className="space-y-4">
                  <div>
                    <button
                      onClick={() => setSelectedAttendanceStatus("")}
                      className="text-sm text-blue-600 hover:text-blue-500"
                    >
                      ← Retour aux options
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Montant de l'avance (DT)</label>
                    <input
                      type="number"
                      value={advanceAmount}
                      onChange={(e) => setAdvanceAmount(e.target.value)}
                      className="w-full p-3 border border-border rounded-lg"
                      placeholder="Ex: 50"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Entrez le montant de l'avance accordée</p>
                  </div>
                  <button
                    onClick={() => {
                      const updatedEmployees = employees.map(emp => {
                        if (emp.id === profileEmployee.id) {
                          const existingAttendance = emp.attendance || {};
                          return {
                            ...emp,
                            attendance: {
                              ...existingAttendance,
                              [profileCalendarDate]: {
                                status: selectedAttendanceStatus,
                                amount: parseFloat(advanceAmount) || 0
                              }
                            }
                          };
                        }
                        return emp;
                      });
                      setEmployees(updatedEmployees);
                      setProfileEmployee(updatedEmployees.find(e => e.id === profileEmployee.id));
                      setProfileAttendanceModalOpen(false);
                      setSelectedAttendanceStatus("");
                      setAdvanceAmount("");
                      setProfileCalendarDate(null);
                    }}
                    disabled={!advanceAmount}
                    className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirmer l'avance
                  </button>
                </div>
              ) : null}
            </div>
            <div className="p-6 border-t border-border">
              <button
                onClick={() => {
                  setProfileAttendanceModalOpen(false);
                  setSelectedAttendanceStatus("");
                  setLateTime("");
                  setAdvanceAmount("");
                }}
                className="w-full py-2 bg-secondary hover:bg-secondary/80 text-foreground font-semibold rounded-lg transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Salary Payment Modal */}
      {salaryModalOpen && salaryEmployee && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div 
            className="fixed inset-0 bg-black/50"
            onClick={() => setSalaryModalOpen(false)}
          />
          <div className="relative bg-card rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <h3 className="text-xl font-bold">Paiements de salaire — {salaryEmployee.fullName}</h3>
            </div>
            <div className="p-6 space-y-6">
              {/* Month Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setCurrentSalaryMonth(new Date(currentSalaryMonth.getFullYear(), currentSalaryMonth.getMonth() - 1))}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Mois Précédent</p>
                  <p className="font-semibold capitalize">
                    {currentSalaryMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                  </p>
                  <p className="text-sm text-muted-foreground">Mois Suivant</p>
                </div>
                <button
                  onClick={() => setCurrentSalaryMonth(new Date(currentSalaryMonth.getFullYear(), currentSalaryMonth.getMonth() + 1))}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>

              {/* Payment Status */}
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <span className="font-semibold text-red-600">Non payé</span>
                </div>
                <p className="text-sm text-red-600 mt-1">Solde net dû: {salaryEmployee.monthlySalary?.toLocaleString() || "0.00"} DT</p>
              </div>

              {/* Salary Breakdown */}
              <div className="space-y-4">
                <div className="bg-secondary/30 rounded-lg p-4">
                  <h4 className="font-semibold mb-3">Fiche de paie déduite</h4>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Salaire de Base</span>
                      <span className="font-medium">{salaryEmployee.monthlySalary?.toLocaleString() || "0.00"} DT</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nombre Jours ouvrables</span>
                      <span className="font-medium">26 jours</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Taux Journalier</span>
                      <span className="font-medium">{(salaryEmployee.monthlySalary / 26).toFixed(3)} DT / jour</span>
                    </div>
                    
                    <div className="flex justify-between text-red-600">
                      <span>Absences (0 j) — Déduction 100%</span>
                      <span className="font-medium">-0.00 DT</span>
                    </div>
                    
                    <div className="flex justify-between text-orange-600">
                      <span>Retards (0 j) — Déduction 50%</span>
                      <span className="font-medium">-0.00 DT</span>
                    </div>
                    
                    <div className="flex justify-between text-purple-600">
                      <span>Avances perçues ce mois-ci</span>
                      <span className="font-medium">-0.00 DT</span>
                    </div>
                    
                    <div className="border-t border-border pt-3 flex justify-between">
                      <span className="font-semibold">Salaire Net à Payer</span>
                      <span className="font-bold text-lg text-blue-600">{salaryEmployee.monthlySalary?.toLocaleString() || "0.00"} DT</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Notes */}
              <div>
                <label className="block text-sm font-medium mb-2">Notes / Remarques de paiement</label>
                <textarea
                  value={paymentNote}
                  onChange={(e) => setPaymentNote(e.target.value)}
                  placeholder="Ajouter une note facultative (Ex: Virement bancaire, payé en espèces)..."
                  className="w-full p-3 border border-border rounded-lg resize-none"
                  rows={3}
                />
              </div>
            </div>
            <div className="p-6 border-t border-border">
              <button
                onClick={() => {
                  setSalaryModalOpen(false);
                  setPaymentNote("");
                }}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors"
              >
                Valider et Marquer comme payé
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment History Modal */}
      {paymentHistoryModalOpen && paymentHistoryEmployee && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div 
            className="fixed inset-0 bg-black/50"
            onClick={() => setPaymentHistoryModalOpen(false)}
          />
          <div className="relative bg-card rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-xl font-bold">Historique des paiements — {paymentHistoryEmployee.fullName}</h3>
              <button
                onClick={() => setPaymentHistoryModalOpen(false)}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <h4 className="font-semibold mb-4">Historique des versements</h4>
              <div className="bg-secondary/30 rounded-lg p-6 text-center">
                <p className="text-muted-foreground">Aucun versement de salaire enregistré pour cet ouvrier.</p>
              </div>
            </div>
            <div className="p-6 border-t border-border">
              <button
                onClick={() => setPaymentHistoryModalOpen(false)}
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {editEmployeeModalOpen && editEmployee && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div 
            className="fixed inset-0 bg-black/50"
            onClick={() => setEditEmployeeModalOpen(false)}
          />
          <div className="relative bg-card rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <h3 className="text-xl font-bold">Modifier Employé</h3>
            </div>
            
            {/* Tabs */}
            <div className="border-b border-border">
              <div className="flex">
                {[
                  { id: 'general', label: 'Général' },
                  { id: 'personal', label: 'Personnel' },
                  { id: 'pro', label: 'Pro & Banque' },
                  { id: 'admin', label: 'Admin & CNSS' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setEditEmployeeTab(tab.id)}
                    className={`flex-1 py-3 px-4 text-sm font-medium transition-colors border-b-2
                      ${editEmployeeTab === tab.id 
                        ? 'border-blue-600 text-blue-600' 
                        : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6 space-y-4">
              {editEmployeeTab === 'general' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nom complet</label>
                    <input
                      type="text"
                      value={editEmployeeForm.fullName || editEmployee.fullName}
                      onChange={(e) => setEditEmployeeForm({...editEmployeeForm, fullName: e.target.value})}
                      className="w-full p-2 border border-border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Poste / Fonction</label>
                    <input
                      type="text"
                      value={editEmployeeForm.position || editEmployee.position}
                      onChange={(e) => setEditEmployeeForm({...editEmployeeForm, position: e.target.value})}
                      className="w-full p-2 border border-border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Département / Service</label>
                    <input
                      type="text"
                      value={editEmployeeForm.department || editEmployee.department}
                      onChange={(e) => setEditEmployeeForm({...editEmployeeForm, department: e.target.value})}
                      className="w-full p-2 border border-border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Salaire de base (DT)</label>
                    <input
                      type="number"
                      value={editEmployeeForm.monthlySalary || editEmployee.monthlySalary}
                      onChange={(e) => setEditEmployeeForm({...editEmployeeForm, monthlySalary: e.target.value})}
                      className="w-full p-2 border border-border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Statut</label>
                    <select
                      value={editEmployeeForm.status || editEmployee.status}
                      onChange={(e) => setEditEmployeeForm({...editEmployeeForm, status: e.target.value})}
                      className="w-full p-2 border border-border rounded-lg"
                    >
                      <option value="Active">Actif</option>
                      <option value="Inactive">Inactif</option>
                      <option value="Vacation">Congé</option>
                      <option value="Suspended">Suspendu</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Jour de paie (par exemple: '1 de chaque mois')</label>
                    <select
                      value={editEmployeeForm.payDay || editEmployee.payDay || "1"}
                      onChange={(e) => setEditEmployeeForm({...editEmployeeForm, payDay: e.target.value})}
                      className="w-full p-2 border border-border rounded-lg"
                    >
                      {[1, 5, 10, 15, 20, 25].map(day => (
                        <option key={day} value={day}>{day} de chaque mois</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {editEmployeeTab === 'personal' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">CIN</label>
                    <input
                      type="text"
                      value={editEmployeeForm.cin || editEmployee.cin || ""}
                      onChange={(e) => setEditEmployeeForm({...editEmployeeForm, cin: e.target.value})}
                      className="w-full p-2 border border-border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Date de Naissance</label>
                    <input
                      type="date"
                      value={editEmployeeForm.dateOfBirth || editEmployee.dateOfBirth || ""}
                      onChange={(e) => setEditEmployeeForm({...editEmployeeForm, dateOfBirth: e.target.value})}
                      className="w-full p-2 border border-border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Adresse</label>
                    <input
                      type="text"
                      value={editEmployeeForm.address || editEmployee.address || ""}
                      onChange={(e) => setEditEmployeeForm({...editEmployeeForm, address: e.target.value})}
                      className="w-full p-2 border border-border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Situation Familiale</label>
                    <select
                      value={editEmployeeForm.maritalStatus || editEmployee.maritalStatus || ""}
                      onChange={(e) => setEditEmployeeForm({...editEmployeeForm, maritalStatus: e.target.value})}
                      className="w-full p-2 border border-border rounded-lg"
                    >
                      <option value="">Sélectionner</option>
                      <option value="Célibataire">Célibataire</option>
                      <option value="Marié">Marié</option>
                      <option value="Mariée">Mariée</option>
                      <option value="Divorcé">Divorcé</option>
                      <option value="Divorcée">Divorcée</option>
                      <option value="Veuf">Veuf</option>
                      <option value="Veuve">Veuve</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Nombre d'enfants</label>
                    <input
                      type="number"
                      value={editEmployeeForm.numberOfChildren || editEmployee.numberOfChildren || 0}
                      onChange={(e) => setEditEmployeeForm({...editEmployeeForm, numberOfChildren: parseInt(e.target.value)})}
                      className="w-full p-2 border border-border rounded-lg"
                    />
                  </div>
                </div>
              )}

              {editEmployeeTab === 'pro' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Responsable Hiérarchique</label>
                    <input
                      type="text"
                      value={editEmployeeForm.manager || editEmployee.manager || ""}
                      onChange={(e) => setEditEmployeeForm({...editEmployeeForm, manager: e.target.value})}
                      className="w-full p-2 border border-border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Date d'Embauche</label>
                    <input
                      type="date"
                      value={editEmployeeForm.joinDate || editEmployee.joinDate || ""}
                      onChange={(e) => setEditEmployeeForm({...editEmployeeForm, joinDate: e.target.value})}
                      className="w-full p-2 border border-border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Type de Contrat</label>
                    <select
                      value={editEmployeeForm.contractType || editEmployee.contractType || ""}
                      onChange={(e) => setEditEmployeeForm({...editEmployeeForm, contractType: e.target.value})}
                      className="w-full p-2 border border-border rounded-lg"
                    >
                      <option value="">Sélectionner</option>
                      <option value="CDI">CDI</option>
                      <option value="CDD">CDD</option>
                      <option value="Stage">Stage</option>
                      <option value="Freelance">Freelance</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Nom de la Banque</label>
                    <input
                      type="text"
                      value={editEmployeeForm.bankName || editEmployee.bankName || ""}
                      onChange={(e) => setEditEmployeeForm({...editEmployeeForm, bankName: e.target.value})}
                      className="w-full p-2 border border-border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">RIB / IBAN</label>
                    <input
                      type="text"
                      value={editEmployeeForm.rib || editEmployee.rib || ""}
                      onChange={(e) => setEditEmployeeForm({...editEmployeeForm, rib: e.target.value})}
                      className="w-full p-2 border border-border rounded-lg"
                    />
                  </div>
                </div>
              )}

              {editEmployeeTab === 'admin' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Fin de Contrat</label>
                    <input
                      type="date"
                      value={editEmployeeForm.contractEnd || editEmployee.contractEnd || ""}
                      onChange={(e) => setEditEmployeeForm({...editEmployeeForm, contractEnd: e.target.value})}
                      className="w-full p-2 border border-border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Régime Horaire</label>
                    <input
                      type="text"
                      value={editEmployeeForm.workSchedule || editEmployee.workSchedule || ""}
                      onChange={(e) => setEditEmployeeForm({...editEmployeeForm, workSchedule: e.target.value})}
                      className="w-full p-2 border border-border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Solde de Congés (Jours)</label>
                    <input
                      type="number"
                      value={editEmployeeForm.vacationBalance || editEmployee.vacationBalance || 0}
                      onChange={(e) => setEditEmployeeForm({...editEmployeeForm, vacationBalance: parseInt(e.target.value)})}
                      className="w-full p-2 border border-border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Numéro CNSS</label>
                    <input
                      type="text"
                      value={editEmployeeForm.cnssNumber || editEmployee.cnssNumber || ""}
                      onChange={(e) => setEditEmployeeForm({...editEmployeeForm, cnssNumber: e.target.value})}
                      className="w-full p-2 border border-border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Contact d'Urgence</label>
                    <input
                      type="text"
                      value={editEmployeeForm.emergencyContact || editEmployee.emergencyContact || ""}
                      onChange={(e) => setEditEmployeeForm({...editEmployeeForm, emergencyContact: e.target.value})}
                      className="w-full p-2 border border-border rounded-lg"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-border flex gap-3">
              <button
                onClick={() => {
                  setEditEmployeeModalOpen(false);
                  setEditEmployeeTab("general");
                  setEditEmployeeForm({});
                  setEditEmployee(null);
                }}
                className="flex-1 py-2 bg-secondary hover:bg-secondary/80 text-foreground font-semibold rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleEditEmployee}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
