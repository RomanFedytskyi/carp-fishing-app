import React from 'react';
import { Form, Input } from 'antd';

const { TextArea } = Input;

const LakeDetails = ({ name, setName, description, setDescription }) => {
  return (
    <>
      <Form.Item label="Name">
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </Form.Item>
      <Form.Item label="Description">
        <TextArea value={description} onChange={(e) => setDescription(e.target.value)} />
      </Form.Item>
    </>
  );
};

export default LakeDetails;
