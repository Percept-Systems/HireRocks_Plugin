import React, { useState, useEffect } from "react";
import { Card, Form, Input, Button, message, Row, Col } from "antd";

const initialOrg = {
  name: "Hire Org",
  address: "Mohali, Punjab, India",
  email: "mayank@perceptsystems.com",
  phone: "9876543210",
  registrationNumber: "LIC-0001",
  createdDate: "2025-04-01",
  password: "12345678",
};

const plainTextStyle = {
  border: "none",
  background: "transparent",
  boxShadow: "none",
  padding: 0,
  color: "rgba(0,0,0,0.85)",
};

const OrgProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(initialOrg);
  }, [form]);

  const onEdit = () => setIsEditing(true);
  const onCancel = () => {
    form.setFieldsValue(initialOrg);
    setIsEditing(false);
  };
  const onSave = async () => {
    try {
      const values = await form.validateFields();
      console.log("Saved values:", values);
      message.success("Organization profile updated!");
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card
      title="Organization Profile"
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
              name="name"
              label="Organization Name"
              rules={[{ required: true, message: "Please enter the name" }]}
            >
              <Input
                size="large"
                readOnly={!isEditing}
                style={!isEditing ? plainTextStyle : {}}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item name="registrationNumber" label="Licence Number">
              <Input size="large" readOnly style={plainTextStyle} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="address"
          label="Address"
          // rules={[{ required: true, message: "Please enter the address" }]}
        >
          <Input.TextArea
            rows={3}
            readOnly={!isEditing}
            style={!isEditing ? plainTextStyle : { padding: 8 }}
            placeholder="Street, City, State, ZIP"
          />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="email"
              label="Contact Email"
              rules={[
                { required: true, message: "Please enter the email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input
                readOnly={!isEditing}
                style={!isEditing ? plainTextStyle : {}}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="phone" label="Phone Number">
              <Input
                readOnly={!isEditing}
                style={!isEditing ? plainTextStyle : {}}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 4: Created Date */}
        <Form.Item name="createdDate" label="Created Date">
          <Input readOnly style={plainTextStyle} />
        </Form.Item>
      </Form>
    </Card>
  );
};

export default OrgProfile;
