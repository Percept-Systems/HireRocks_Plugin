import React, { useState, useEffect } from "react";
import {
  DatePicker,
  Select,
  Button,
  message,
  Card,
  Skeleton,
  Modal,
  Input,
  Menu,
  Dropdown,
  Avatar,
} from "antd";
import { PlusOutlined, UserOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";
import { useNavigate } from "react-router-dom";

const { RangePicker } = DatePicker;

function DashboardEmp() {
  const navigate = useNavigate();
  const [selectedDates, setSelectedDates] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([
    { name: "John Doe", email: "john@example.com" },
    { name: "Jane Smith", email: "jane@example.com" },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newEmployeeName, setNewEmployeeName] = useState("");
  const [newEmployeeEmail, setNewEmployeeEmail] = useState("");

  const screenshots = ["Screenshot 1", "Screenshot 2", "Screenshot 3"];

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      navigate("/");
    }
  }, []);

  const handleSearch = () => {
    if (selectedDates) {
      setShowResults(true);
      setLoading(true);
      setTimeout(() => setLoading(false), 2000);
    } else {
      message.warning("🚨 Please select an Employee and a Date Range!");
    }
  };

  const handleAddEmployee = () => {
    if (!newEmployeeName || !newEmployeeEmail) {
      message.error("Please enter both name and email!");
      return;
    }
    setEmployees([
      ...employees,
      { name: newEmployeeName, email: newEmployeeEmail },
    ]);
    setModalVisible(false);
    setNewEmployeeName("");
    setNewEmployeeEmail("");
    message.success("Employee added successfully!");
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/");
  };

  const menu = (
    <Menu>
      <Menu.Item key="profile" onClick={() => navigate("/employeeProfile")}>
        Profile
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="max-w-7xl mx-auto min-h-[500px] bg-white text-gray-800 rounded-lg shadow-lg p-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-center mb-6">
          📊 Tracker Details
        </h1>

        <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
          <Avatar
            icon={<UserOutlined />}
            style={{ backgroundColor: "#32a8df" }}
            className="cursor-pointer"
            size="large"
          />
        </Dropdown>
      </div>

      {/* Form Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Employee Selector with Search */}
        <div className="flex flex-col">
          <label className="font-medium mb-2">👤 Employee Name</label>
          <div className="flex gap-2">
            <h3>Dummy user</h3>
          </div>
        </div>

        {/* Date Range Picker */}
        <div className="flex flex-col">
          <label className="font-medium mb-2">📅 Select Date Range</label>
          <RangePicker
            className="w-full"
            format="DD-MM-YYYY"
            onChange={setSelectedDates}
          />
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <Button type="primary" block onClick={handleSearch}>
            🔍 Search
          </Button>
        </div>
      </div>

      {/* Employee Modal */}
      <Modal
        title="Add Employee"
        open={modalVisible}
        onOk={handleAddEmployee}
        onCancel={() => setModalVisible(false)}
      >
        <Input
          placeholder="Employee Name"
          className="mb-3"
          value={newEmployeeName}
          onChange={(e) => setNewEmployeeName(e.target.value)}
        />
        <Input
          placeholder="Employee Email"
          value={newEmployeeEmail}
          onChange={(e) => setNewEmployeeEmail(e.target.value)}
        />
      </Modal>

      {/* Results Section */}
      {showResults && (
        <>
          <Card className="mb-6 text-center font-semibold" bordered>
            ⏳ Total Hours Burned:{" "}
            <span className="text-blue-600">5 hours</span>
          </Card>
          <h2 className="text-2xl font-semibold mb-4">📸 Screenshots</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {loading
              ? screenshots.map((_, index) => (
                  <Skeleton.Image
                    key={index}
                    active
                    className="h-[150px] w-full"
                  />
                ))
              : screenshots.map((screenshot, index) => (
                  <Card key={index} className="text-center shadow-md h-[150px]">
                    {screenshot}
                  </Card>
                ))}
          </div>
        </>
      )}
    </div>
  );
}

export default DashboardEmp;
