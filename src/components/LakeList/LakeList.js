import React, { useContext } from 'react';
import { List, Button, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { LakesContext } from '../../LakesContext';
import LakePreview from '../LakePreview/LakePreview';
import { collection, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from "../../AuthContext";

import './LakeList.scss';

const LakeList = ({ onLakeSelect }) => {
  const { lakes } = useContext(LakesContext);
  const { currentUser } = useAuth();

  const getLastNotes = (notes) => {
    return notes
      .filter((note) => note.type === 'fishBite')
      .slice(-3)
      .map(
        (note) => `Bait: ${note.fishBite.bait}, Distance: ${note.fishBite.distance}m`
      )
      .join(' | ');
  };

  const handleDeleteLake = async (e, lakeId) => {
    e.stopPropagation();
    try {
      await deleteDoc(doc(collection(db, "users", currentUser.uid, "userLakes"), lakeId));
    } catch (error) {
      console.error("Error deleting lake:", error);
    }
  };  

  return (
    <div className="lake-list">
      <h2>Lakes</h2>
      <List
        itemLayout="horizontal"
        dataSource={lakes}
        renderItem={(lake, index) => (
          <List.Item
            className="lake-list-item"
            onClick={() => onLakeSelect(index)}
          >
            <div className="lake-info">
              <List.Item.Meta title={lake.name} description={lake.description} />
              <div className="lake-notes">{getLastNotes(lake.notes)}</div>
            </div>
            <LakePreview lake={lake} className="lake-preview" />
            <Popconfirm
              title="Are you sure you want to delete this lake?"
              onConfirm={(e) => handleDeleteLake(e, lake.id)}
              onCancel={(e) => e.stopPropagation()}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="text"
                shape="circle"
                className="delete-lake-button"
                icon={<DeleteOutlined />}
                onClick={(e) => e.stopPropagation()}
              />
            </Popconfirm>
          </List.Item>
        )}
      />
      <Button type="primary" onClick={() => onLakeSelect(null)}>
        Add Lake
      </Button>
    </div>
  );
};

export default LakeList;
