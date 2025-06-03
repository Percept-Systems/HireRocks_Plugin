import React, { useState, useEffect } from "react";
import { Card, Form, Input, Button, message, Row, Col, DatePicker } from "antd";
import dayjs from "dayjs";

const initialEmployee = {
  firstName: "Dummy",
  lastName: "Employee",
  email: "dummy@example.com",
  phone: "9876543212",
  department: "Engineering",
  dob: "1990-04-15",
  employeeId: "EMP-12345",
  hireDate: "2025-03-15",
};

const plainTextStyle = {
  border: "none",
  background: "transparent",
  boxShadow: "none",
  padding: 0,
  color: "rgba(0,0,0,0.85)",
};

const EmployeeProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      ...initialEmployee,
      dob: dayjs(initialEmployee.dob),
    });
  }, [form]);

  const onEdit = () => setIsEditing(true);
  const onCancel = () => {
    form.setFieldsValue({
      ...initialEmployee,
      dob: dayjs(initialEmployee.dob),
    });
    setIsEditing(false);
  };
  const onSave = async () => {
    try {
      const values = await form.validateFields();
      console.log("Saved employee:", values);
      message.success("Employee profile updated!");
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card
      title="Employee Profile"
      style={{ maxWidth: 900, margin: "40px auto", padding: 24 }}
      extra={
        !isEditing ? (
          <Button type="primary" onClick={onEdit}>
            Edit
          </Button>
        ) : (
          <>
            <Button onClick={onCancel} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button type="primary" onClick={onSave}>
              Save
            </Button>
          </>
        )
      }
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col xs={24} sm={16}>
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[{ required: true, message: "Please enter first name" }]}
            >
              <Input
                size="large"
                readOnly={!isEditing}
                style={!isEditing ? plainTextStyle : {}}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item name="employeeId" label="Employee ID">
              <Input size="large" readOnly style={plainTextStyle} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={16}>
            <Form.Item name="lastName" label="Last Name">
              <Input
                size="large"
                readOnly={!isEditing}
                style={!isEditing ? plainTextStyle : {}}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item name="hireDate" label="Hire Date">
              <Input readOnly style={plainTextStyle} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item name="department" label="Department">
              <Input readOnly style={plainTextStyle} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="dob"
              label="Date of Birth"
              rules={[
                { required: true, message: "Please select date of birth" },
              ]}
            >
              {isEditing ? (
                <DatePicker
                  style={{ width: "100%" }}
                  format="YYYY-MM-DD"
                  inputReadOnly
                />
              ) : (
                <Input
                  readOnly
                  style={plainTextStyle}
                  value={form.getFieldValue("dob")?.format("YYYY-MM-DD")}
                />
              )}
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="email"
              label="Email"
              // rules={[
              //   { required: true, message: "Please enter email" },
              //   { type: "email", message: "Please enter a valid email" },
              // ]}
            >
              <Input readOnly style={plainTextStyle} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[{ required: true, message: "Please enter phone number" }]}
            >
              <Input
                readOnly={!isEditing}
                style={!isEditing ? plainTextStyle : {}}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default EmployeeProfile;
