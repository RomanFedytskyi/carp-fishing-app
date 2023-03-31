import React, { useRef, useState } from "react";
import { Form, Input, Button, Alert } from "antd";
import { useAuth } from "../../AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "./SignIn.scss";

const SignIn = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { signIn } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit() {
    try {
      setError("");
      setLoading(true);
      await signIn(emailRef.current.input.value, passwordRef.current.input.value);
      navigate("/lakes");
    } catch {
      setError("Failed to log in");
    }
    setLoading(false);
  }

  return (
    <div className="signin-form-container">
      <div className="signin">
        <h2>Log In</h2>
        {error && <Alert message={error} type="error" />}
        <Form onFinish={handleSubmit}>
          <Form.Item>
            <Input placeholder="Email" ref={emailRef} required />
          </Form.Item>
          <Form.Item>
            <Input.Password placeholder="Password" ref={passwordRef} required />
          </Form.Item>
          <Button type="primary" htmlType="submit" disabled={loading}>
            Log In
          </Button>
        </Form>
        <div>
          Need an account? <Link to="/sign-up">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
