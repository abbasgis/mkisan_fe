import React, { useState } from "react";


function WebGIS() {
    const [isLeftPaneOpen, setIsLeftPaneOpen] = useState(true);
    const [isRightPaneOpen, setIsRightPaneOpen] = useState(true);

    const handleToggleLeftPane = () => {
        setIsLeftPaneOpen(!isLeftPaneOpen);
    };

    const handleToggleRightPane = () => {
        setIsRightPaneOpen(!isRightPaneOpen);
    };

    return (
        <div className="webgis-container">
            <div className="header">
                <nav className="navbar">
                    {/* Add your navbar content here */}
                </nav>
            </div>

            <div className="left-pane" style={{ width: isLeftPaneOpen ? "300px" : "0" }}>
                {/* Add your left pane content here */}
                <button onClick={handleToggleLeftPane}>Toggle Left Pane</button>
            </div>

            <div className="right-pane" style={{ width: isRightPaneOpen ? "300px" : "0" }}>
                {/* Add your right pane content here */}
                <button onClick={handleToggleRightPane}>Toggle Right Pane</button>
            </div>

            <div className="map-container">
              <p>Shakir</p>
            </div>

            <div className="footer">
                {/* Add your footer content here */}
            </div>
        </div>
    );
}

export default WebGIS;