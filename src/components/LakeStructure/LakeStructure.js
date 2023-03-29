import React, { useState, useEffect } from 'react';
import { InputNumber, Input, Button, Form } from 'antd';
import createSVGPlot from './createSVGPlot';
import './LakeStructure.scss';

const LakeStructure = ({ numberOfRays = 6, rayData = [], updateRayData, initialDistance = 1, updateDistance }) => {
  const [distance, setDistance] = useState(initialDistance);
  const [selectedRay, setSelectedRay] = useState(null);
  const [depthInputValue, setDepthInputValue] = useState('');
  const [rayDataState, setRayDataState] = useState(rayData.length ? rayData : Array(numberOfRays).fill([]));


  const svgRef = React.createRef();

  const handleRayClick = (rayIndex) => {
    setSelectedRay(rayIndex);
    if (!rayDataState[rayIndex]) {
      setRayDataState({ ...rayDataState, [rayIndex]: [] });
    }
  };

  const handleDepthSubmit = () => {
    if (depthInputValue) {
      const newDepths = depthInputValue.split(',').map(parseFloat);
      const updatedRayData = [...rayDataState];

      updatedRayData[selectedRay] = newDepths.reverse().map((depth) => ({
        depth,
        distance: distance,
      }));
      setRayDataState(updatedRayData);
      updateRayData(updatedRayData);
      setDepthInputValue('');
      setSelectedRay(null);
    } else {
      console.error('No depth values provided');
    }
  };

  useEffect(() => {
    // Update the SVG plot when the number of rays or distance changes
    if (svgRef.current) {
      createSVGPlot(svgRef.current, numberOfRays, rayDataState, distance, handleRayClick);
    }
  }, [numberOfRays, rayDataState, distance, handleRayClick]);

  return (
    <div className="lake-structure">
      <h3>Lake Structure</h3>
      <Form.Item label="Distance between measuring points (meters)">
        <InputNumber
          value={distance}
          onChange={(value) => {
            setDistance(value);
            updateDistance(value);
          }}
          min={1}
          step={0.1}
        />
      </Form.Item>
      <svg ref={svgRef} width="100%" height="300px" />
      {selectedRay !== null && (
        <div className="depth-form">
          <h4>Enter depth values for ray #{selectedRay + 1}</h4>
          <div>
            <label htmlFor="depths">Depths (comma-separated)</label>
            <Input
              id="depths"
              value={depthInputValue}
              onChange={(e) => setDepthInputValue(e.target.value)}
            />
          </div>
          <div className="depth-form-buttons">
            <Button type="primary" onClick={handleDepthSubmit}>
              Save
            </Button>
            <Button onClick={() => setSelectedRay(null)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LakeStructure;
