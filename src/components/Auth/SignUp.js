import React, { useRef, useState } from "react";
import { Form, Input, Button, Alert } from "antd";
import { useAuth } from "../../AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "./SignUp.scss";

const SignUp = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signUp } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit() {
    if (passwordRef.current.input.value !== passwordConfirmRef.current.input.value) {
      return setError("Passwords do not match");
    }

    try {
      setError("");
      setLoading(true);
      await signUp(emailRef.current.input.value, passwordRef.current.input.value);
      navigate("/");
    } catch {
      setError("Failed to create an account");
    }
    setLoading(false);
  }

  return (
    <div className="signup-form-container">
      <div className="signup">
        <h2>Sign Up</h2>
        {error && <Alert message={error} type="error" />}
        <Form onFinish={handleSubmit}>
          <Form.Item>
            <Input placeholder="Email" ref={emailRef} required />
          </Form.Item>
          <Form.Item>
            <Input.Password placeholder="Password" ref={passwordRef} required />
          </Form.Item>
          <Form.Item>
            <Input.Password placeholder="Confirm Password" ref={passwordConfirmRef} required />
          </Form.Item>
          <Button type="primary" htmlType="submit" disabled={loading}>
            Sign Up
          </Button>
        </Form>
        <div>
          Already have an account? <Link to="/sign-in">Log In</Link>
        </div>
      </div>
    </div>
  );
}

export default SignUp;