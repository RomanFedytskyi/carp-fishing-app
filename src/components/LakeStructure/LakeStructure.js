import React, { useState, useEffect } from 'react';
import { Input, Button, Form, Space, Switch } from 'antd';
import createSVGPlot from './createSVGPlot';
import './LakeStructure.scss';

const LakeStructure = ({
  numberOfRays = 7,
  updateNumberOfRays,
  rayData = [],
  updateRayData,
  initialDistance = 1,
  updateDistance,
  radiusInMeters = 100,
  updateRadiusInMeters,
}) => {
  const [distance, setDistance] = useState(initialDistance);
  const [selectedRay, setSelectedRay] = useState(null);
  const [depthInputValue, setDepthInputValue] = useState('');
  const [rayDataState, setRayDataState] = useState(rayData.length ? rayData : Array(numberOfRays).fill([]));
  const [zoomEnabled, setZoomEnabled] = useState(true);

  const svgRef = React.createRef();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleRayClick = (rayIndex) => {
    setSelectedRay(rayIndex);
    if (!rayDataState[rayIndex]) {
      setRayDataState({ ...rayDataState, [rayIndex]: [] });
    }
  };

  const toggleZoom = () => {
    setZoomEnabled(!zoomEnabled);
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

  const handleNumberOfRaysChange = (e) => {
    updateNumberOfRays(+e.target.value);
  };

  // Function to check if there is depth in any ray
  const hasDepthInAnyRay = () => {
    return rayData.some((ray) => ray.length > 0);
  };

  useEffect(() => {
    // Update the SVG plot when the number of rays or distance changes
    if (svgRef.current) {
      createSVGPlot(
        svgRef.current,
        numberOfRays,
        rayDataState,
        distance,
        handleRayClick,
        radiusInMeters,
        zoomEnabled
      );
    }
  }, [svgRef, numberOfRays, rayDataState, distance, handleRayClick, radiusInMeters, zoomEnabled]);

  return (
    <div className="lake-structure">
      <h3>Lake Structure</h3>
      <Form.Item>
        <Space direction='vertical'>
          <Input
            type="number"
            addonBefore="Rays:"
            value={numberOfRays}
            onChange={handleNumberOfRaysChange}
            min={1}
            max={20}
            disabled={hasDepthInAnyRay()} // Disable input if there's depth in any ray
          />
          <Input
            type="number"
            addonBefore="Total distance (meters):"
            value={radiusInMeters}
            onChange={(e) => updateRadiusInMeters(+e.target.value)}
            disabled={hasDepthInAnyRay()} // Disable input if there's depth in any ray
          />
          <Input
            type="number"
            addonBefore="Distance between points (meters):"
            value={distance}
            onChange={(e) => {
              setDistance(+e.target.value);
              updateDistance(+e.target.value);
            }}
            min={1}
            step={0.1}
          />
          <div className="zoom-button-container">
            <Switch
              checked={zoomEnabled}
              onChange={toggleZoom}
              checkedChildren="Zoom Enabled"
              unCheckedChildren="Zoom Disabled"
            />
          </div>
        </Space>
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
