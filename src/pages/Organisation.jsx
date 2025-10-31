import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmpLogin from "../components/EmpLogin";
import axios from "axios";
import { useEffect } from "react";

function Organization() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [organizationName, setOrganizationName] = useState("");
  const [organizationPass, setOrganizationPass] = useState("");
  const [email, setEmail] = useState("");
  const [mailContent, setMailContent] = useState("");
  const [createMode, setCreateMode] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [errors, setErrors] = useState({}); // State to store validation errors
  const [error, setError] = useState({}); // State to store validation errors
  const [otpError, setotpError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orgError, setorgError] = useState(false);
  const [platform, setPlatform] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [zohoInfo, setZohoInfo] = useState(null);
  const [employeesList, setEmployeesList] = useState([]);

  const APP_URI = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let detectedPlatform = params.get("platform");

    if (!detectedPlatform) {
      const ref = document.referrer || "";
      if (ref.includes("force.com") || ref.includes("salesforce.com")) {
        detectedPlatform = "salesforce";
      } else if (ref.includes("zoho.com") || ref.includes("zoho")) {
        detectedPlatform = "zoho";
      } else {
        detectedPlatform = "unknown";
      }
    }

    console.log("Detected platform:", detectedPlatform);
    setPlatform(detectedPlatform);
  }, []);

  useEffect(() => {
    if (platform === "salesforce") {
      console.log("Platform is Salesforce — loading Salesforce users...");
      const accessToken = localStorage.getItem("sf_access_token");
      if (!accessToken) {
        loginToSalesforce();
      } else {
        console.log("Found existing Salesforce token, fetching users...");
        fetchSalesforceUsers(accessToken);
      }
    }
  }, [platform]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("accessToken");

    if (tokenFromUrl && platform === "salesforce") {
      console.log("Found access token from Salesforce redirect:", tokenFromUrl);
      localStorage.setItem("sf_access_token", tokenFromUrl);
      fetchSalesforceUsers(tokenFromUrl);
    }
  }, [platform]);

  // zoho sdk setup to fetch users

  if (platform === "zoho") {
    console.log("📦 Loading Zoho users...");
    if (window.ZOHO && window.ZOHO.embeddedApp && window.ZOHO.CRM) {
      window.ZOHO.embeddedApp.on("PageLoad", function (data) {
        console.log("Zoho PageLoad event data:", data);

        window.ZOHO.CRM.API.getAllUsers({ Type: "AllUsers" })
          .then((response) => {
            console.log("Fetched Zoho Users:", response.users);
            if (response.users && Array.isArray(response.users)) {
              const transformedUsers = response.users.map((u) => ({
                id: u.id,
                name: u.full_name,
                email: u.email,
                role: u.role ? u.role.name : "N/A",
                profile: u.profile ? u.profile.name : "N/A",
                status: u.status,
              }));
              setEmployeesList(transformedUsers);
            }
          })
          .catch((error) =>
            console.error("Failed to fetch Zoho users:", error)
          );

        Promise.all([
          window.ZOHO.CRM.CONFIG.getCurrentUser(),
          window.ZOHO.CRM.CONFIG.getOrgInfo(),
        ])
          .then(([user, org]) => setZohoInfo({ user, org }))
          .catch((err) => console.error("Error fetching Zoho info:", err));
      });

      window.ZOHO.embeddedApp.init();
    } else {
      console.warn("ZOHO SDK not loaded yet.");
    }
  }

  // Salesforce OAuth flow
  const loginToSalesforce = () => {
    console.log("Starting Salesforce OAuth...");
    const clientId =
      "3MVG97L7PWbPq6Uw4WgqpFT3TlrkMjP0R8N09uAqX_a3aQgRaiOaan_wJscQ9APo6d8Fe85pLYnWKs9Y18xdF";
    const redirectUri =
      "https://trackerapi.hirerocks.com/api/tracker/saleforce/callback";
    const loginUrl = "https://login.salesforce.com/services/oauth2/authorize";
    const authUrl = `${loginUrl}?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=api%20refresh_token`;

    // open in the same tab — Salesforce will redirect back through backend → frontend
    // window.open(authUrl, "_blank", "width=600,height=700");
    window.location.href = authUrl;
  };

  // Handle View Click (Step 1 for Viewing Organization)
  const handleViewClick = async () => {
    try {
      setLoading(true);
      setErrors({});
      if (!organizationName.trim() || !organizationPass.trim()) {
        setErrors({ organizationError: "Please Fill all the fields!" });
        return;
      }
      const loginResponse = await axios.post(`${APP_URI}/api/Account/Login`, {
        UserName: organizationName,
        Password: organizationPass,
      });

      let loginData = loginResponse.data;
      if (typeof loginData === "string") {
        loginData = JSON.parse(loginData);
      }

      if (loginData.access_token) {
        localStorage.setItem("access_token", loginData.access_token);
        alert("Login successful!");
        navigate("/tracker");
      } else {
        alert("Login failed. Please try again.");
      }
    } catch (error) {
      // console.error("Error viewing organization:", error);
      setErrors({ organizationError: "Invalid Credentials!" });
    } finally {
      setLoading(false);
    }
  };

  // Handle Create Organization Mode Activation
  const handleCreateOrganization = () => {
    setCreateMode(true);
    setStep(1);
  };

  const verifyOTP = async () => {
    if (!mailContent) {
      alert("Please enter the OTP.");
      return;
    }
    setotpError(false);
    setLoading(true);
    try {
      const response = await axios.get(
        `${APP_URI}/api/Account/VerifyEmailAddress`,
        {
          params: { emailVerificationCode: mailContent },
        }
      );

      if (
        response.data?.SuccessMessage ===
        "You email address is verified successfully"
      ) {
        alert(response.data.SuccessMessage);

        await new Promise((resolve) => setTimeout(resolve, 2000));

        const username = email.split("@")[0];
        const loginResponse = await axios.post(`${APP_URI}/api/Account/Login`, {
          UserName: username,
          Password: organizationPass,
          RememberMe: true,
        });

        let loginData = loginResponse.data;
        if (typeof loginData === "string") {
          loginData = JSON.parse(loginData);
        }

        if (loginData.access_token) {
          localStorage.setItem("access_token", loginData.access_token);
          alert("Login successful!");
          setStep(3);
          setLoading(false);
        } else {
          setLoading(false);
          alert("Login failed. Please try again.");
        }
      } else {
        setLoading(false);
        setotpError(true);
        alert("Invalid OTP. Please try again.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error verifying OTP:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  // 🔹 Function to fetch Salesforce users
  const fetchSalesforceUsers = async (accessToken) => {
    if (!accessToken) {
      console.error("No access token provided to fetch Salesforce users.");
      return;
    }

    try {
      setLoading(true);
      console.log("Fetching Salesforce users with access token:", accessToken);

      const response = await axios.get(
        `${APP_URI}/api/tracker/saleforce/users`,
        {
          params: { accessToken },
        }
      );

      // Expect response.data to be an array of users
      if (response.status === 200 && response.data) {
        console.log("Salesforce users fetched successfully:", response.data);

        // Extract names only
        const users = Array.isArray(response.data.records)
          ? response.data.records.map((u) => ({
              id: u.Id,
              name: u.Name,
            }))
          : [];

        setEmployeesList(users);
      } else {
        console.warn("⚠️ Unexpected response while fetching users:", response);
      }
    } catch (error) {
      console.error("Error fetching Salesforce users:", error);
      alert("Failed to fetch Salesforce users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Next Step
  const handleNextStep = async () => {
    let newErrors = {};
    if (step === 1) {
      if (!organizationName.trim())
        newErrors.organizationName = "Organization Name is required";
      if (!email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = "Invalid email format";
      }
      if (!organizationPass.trim()) {
        newErrors.organizationPass = "Password is required";
      } else if (organizationPass.length < 6) {
        newErrors.organizationPass = "Password must be at least 6 characters";
      }
    } else if (step === 2 && !mailContent.trim()) {
      newErrors.mailContent = "OTP is required";
    }

    // If errors exist, set them in state and stop execution
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    if (createMode && step === 1) {
      // Step 1: Create Organization API Call
      setLoading(true);
      setorgError(false);
      try {
        const response = await axios.post(`${APP_URI}/PostOrganization`, {
          Email: email,
          Password: organizationPass,
          OrganizationTitle: organizationName,
          IsRegisterationSuccessFull: true,
          Platform: platform,
        });
        console.log(response);
        if (response.status == 200) {
          alert(
            "Organization created successfully! Please check your email for the OTP."
          );
          setStep(step + 1); // Move to OTP verification step
        } else {
          alert("Organization creation failed. Please try again.");
        }
      } catch (error) {
        console.error("Error creating organization:", error);
        setorgError(true);
      } finally {
        setLoading(false); // Set loading to false after the API call (success or failure)
      }
    } else {
      setStep(step + 1);
    }
    // }
  };

  // Handle Adding Employee
  const handleAddEmployee = async () => {
    if (FirstName && LastName && employeeEmail) {
      // Create a new employee object
      const newEmployee = {
        FirstName,
        LastName,
        Email: employeeEmail,
        IsRegisterationSuccessFull: false,
      };

      // Update state immediately
      setEmployees([
        ...employees,
        { FirstName, LastName, email: employeeEmail },
      ]);

      // Clear input fields
      setFirstName("");
      setLastName("");
      setEmployeeEmail("");

      // Get token from localStorage
      const token = localStorage.getItem("access_token");

      if (!token) {
        alert("Authentication failed. Please log in again.");
        return;
      }

      try {
        // Send API request to add employee
        const response = await axios.post(
          `${APP_URI}/api/Account/AddWorker`,
          newEmployee,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          alert("Employee added successfully!");
        } else {
          alert("Failed to add employee.");
        }
      } catch (error) {
        console.error("Error adding employee:", error);
        alert("An error occurred while adding the employee.");
      }
    } else {
      alert("Please enter the employee's first name, last name, and email.");
    }
  };

  //  add employee multiselect
  const handleSelect = (emp) => {
    const isSelected = selectedEmployees.some((e) => e.id === emp.id);
    if (isSelected) {
      setSelectedEmployees(selectedEmployees.filter((e) => e.id !== emp.id));
    } else if (selectedEmployees.length < 10) {
      setSelectedEmployees([...selectedEmployees, emp]);
    }
  };

  const handleDone = async () => {
    if (selectedEmployees.length === 0) {
      alert("No employees to add.");
      return;
    }
    setStep(5);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-950  to-green-200  text-white flex items-center justify-center">
      <div className="bg-white relative tempo text-black p-8 rounded-lg w-[85%] h-[90vh] shadow-lg ">
        {/* <h2 className="absolute ml-[40%] text-center text-[40px] text-green-700">HireRocks</h2> */}
        {/* Step 1: Organization Input for Viewing */}
        {step === 1 && !createMode && (
          <div className="flex justify-center items-center w-full h-full">
            <div className="flex w-[80%] h-auto border border-gray-300 shadow-lg rounded-lg overflow-hidden">
              {/* Left Section */}
              <div className="w-1/2 p-8 flex flex-col justify-center bg-white">
                <h2 className="text-xl font-bold text-gray-700 mb-4">
                  Enter Your Organization Name
                </h2>
                {errors.organizationError && (
                  <span className="text-red-500 text-sm">
                    {errors.organizationError}
                  </span>
                )}
                <input
                  type="text"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  className="w-full p-3 rounded-md border border-gray-300 text-gray-800 outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Organization Name"
                />

                <input
                  type="password"
                  value={organizationPass}
                  onChange={(e) => setOrganizationPass(e.target.value)}
                  className="w-full p-3 mt-4 rounded-md border border-gray-300 text-gray-800 outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Password"
                />
                <button
                  onClick={handleViewClick}
                  className="w-full bg-green-500 hover:bg-green-700 text-white py-2 rounded-md mt-4 transition-all"
                >
                  {loading ? "Opening Org..." : "View Organization"}
                </button>
                <p className="text-center text-sm text-gray-500 mt-4">
                  New to HireRocks?{" "}
                  <button
                    onClick={handleCreateOrganization}
                    className="text-green-600 hover:underline"
                  >
                    Create Organization
                  </button>
                </p>
              </div>

              {/* Vertical Separator */}
              <div className="w-[2px] bg-gray-300"></div>

              {/* Right Section */}
              <div className="w-1/2 h-full p-0 flex flex-col justify-center bg-gray-100">
                <EmpLogin />
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Create Organization Flow */}
        {createMode && step === 1 && (
          <div className="w-full h-full flex justify-center items-center">
            <div className="space-y-6 w-full h-full ">
              <label className="block text-4xl font-bold text-gray-700 text-center">
                Create Organization
              </label>
              {orgError && (
                <p className="text-red-500 text-sm">Name is already taken.</p>
              )}
              <div>
                <input
                  type="text"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  className="w-full p-3 rounded-md border border-gray-300 text-gray-800 outline-none"
                  placeholder="Enter your Organization Name"
                />
                {errors.organizationName && (
                  <p className="text-red-500 text-sm">
                    {errors.organizationName}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-md border border-gray-300 text-gray-800 outline-none"
                  placeholder="Enter Your Email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>

              <div>
                <input
                  type="password"
                  value={organizationPass}
                  onChange={(e) => setOrganizationPass(e.target.value)}
                  className="w-full p-3 rounded-md border border-gray-300 text-gray-800 outline-none"
                  placeholder="Enter Your Password"
                />
                {errors.organizationPass && (
                  <p className="text-red-500 text-sm">
                    {errors.organizationPass}
                  </p>
                )}
              </div>
              <button
                onClick={handleNextStep}
                className="w-full bg-green-500 hover:bg-green-700 text-white py-2 rounded-md"
              >
                {loading ? "loading....." : "Next"}
              </button>
            </div>
          </div>
        )}

        {createMode && step === 2 && (
          <div className="w-full h-full flex justify-center items-center">
            <div className="space-y-6 w-[450px]">
              <label className="block text-lg font-bold text-gray-700">
                Enter the OTP sent to your email{" "}
                <span className="font-extrabold text-green-700">{email}</span>
              </label>
              <input
                type="text"
                value={mailContent}
                onChange={(e) => setMailContent(e.target.value)}
                className="w-full p-3 rounded-md border border-gray-300 text-gray-800"
                placeholder="OTP"
              />
              {otpError && (
                <p className="text-red-500 text-sm">Incorrect OTP</p>
              )}
              <button
                onClick={verifyOTP}
                className="w-full bg-green-500 hover:bg-green-700 text-white py-2 rounded-md"
              >
                {loading ? "loading....." : "Submit"}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Add Employees */}
        {createMode && step === 3 && (
          <div className="w-[400px] mx-auto">
            <label className="block text-lg font-bold text-gray-700 mb-2">
              Select Employees (max 10)
            </label>

            <div className="relative">
              {/* Selected employees box */}
              <div
                className="border border-gray-300 rounded-md p-3 cursor-pointer bg-white overflow-y-auto max-h-40"
                onClick={() => setIsOpen(!isOpen)}
              >
                {selectedEmployees.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedEmployees.map((emp) => (
                      <span
                        key={emp.id}
                        className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-sm flex items-center"
                      >
                        {emp.name}
                        <button
                          className="ml-1 text-red-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelect(emp);
                          }}
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-400">Select employees...</span>
                )}
              </div>

              {/* Dropdown — absolute inside parent so it stays within white box */}
              {isOpen && (
                <div className="absolute left-0 right-0 mt-1 border border-gray-300 rounded-md max-h-48 overflow-y-auto bg-white shadow-lg z-10">
                  {employeesList.length === 0 ? (
                    <div className="p-2 text-gray-500 italic">
                      {platform === "zoho"
                        ? "No Zoho users found."
                        : platform === "salesforce"
                        ? "No Salesforce users found."
                        : "No users to display."}
                    </div>
                  ) : (
                    employeesList.map((emp) => {
                      const isSelected = selectedEmployees.some(
                        (e) => e.id === emp.id
                      );
                      return (
                        <div
                          key={emp.id}
                          onClick={() => handleSelect(emp)}
                          className={`flex justify-between items-center p-2 cursor-pointer ${
                            isSelected ? "bg-blue-100" : "hover:bg-gray-100"
                          }`}
                        >
                          <span className="text-gray-800">{emp.name}</span>
                          {isSelected && (
                            <span className="text-blue-600 font-bold">✓</span>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {/* Button next to dropdown */}
            <div className="flex items-center justify-between mt-3">
              <p className="text-sm text-gray-600">
                Selected: {selectedEmployees.length} / 10
              </p>
              <button
                onClick={handleDone}
                className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Final Confirmation */}
        {step === 5 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Setup Complete!
            </h2>
            <p className="text-gray-600">
              Your organization is ready with employees added. You can now
              proceed to the dashboard or any other actions.
            </p>
            <button
              className="w-full bg-green-500 hover:bg-green-700 text-white py-2 rounded-md mt-4"
              onClick={() => navigate("/tracker")}
            >
              Go To Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Organization;
