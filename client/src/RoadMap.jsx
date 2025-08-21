import React, { useState } from 'react';
import { X, Download } from 'lucide-react';

export default function Roadmap({ roadmap = [] }) {
  const [selectedItem, setSelectedItem] = useState(null);

  const getStageNumber = (index) => {
    return index + 1;
  };

  // Transform the roadmap data from backend into visual roadmap format
  const transformRoadmapData = (data) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return [];
    }

    const colors = [
      'bg-yellow-500',
      'bg-purple-600', 
      'bg-purple-700',
      'bg-purple-800',
      'bg-blue-600',
      'bg-orange-500',
      'bg-green-600',
      'bg-red-600'
    ];

    // Define positions for vertical layout with proper spacing
    const minGap = 15; // Minimum gap between items as percentage  
    const startTop = 8; // Starting position from top
    const positions = data.map((_, index) => ({
      top: `${startTop + (index * minGap)}%`,
      left: '50%'
    }));

    return data.map((item, index) => ({
      id: `stage-${index}`,
      title: item?.stage || `STAGE ${index + 1}`,
      color: colors[index % colors.length],
      position: positions[index % positions.length],
      description: item?.description || 'No description available',
      heading: item?.heading || 'Stage Heading',
      techStack: Array.isArray(item?.techStack) ? item.techStack : [], // Store the tech stack directly
      originalIndex: index // Keep track of original index
    }));
  };

  const roadmapItems = transformRoadmapData(roadmap);

  // Create path points based on positions
  const createPathPoints = () => {
    return roadmapItems.map(item => ({
      x: parseFloat(item.position.left.replace('%', '')),
      y: parseFloat(item.position.top.replace('%', ''))
    }));
  };

  const pathPoints = createPathPoints();

  const createPath = () => {
    if (pathPoints.length < 2) return '';
    
    // Create a straight vertical line
    const startY = Math.min(...pathPoints.map(p => p.y));
    const endY = Math.max(...pathPoints.map(p => p.y));
    const centerX = 50; // Center of the container
    
    return `M ${centerX} ${startY} L ${centerX} ${endY}`;
  };

  const handleDotClick = (item) => {
    setSelectedItem(item);
  };

  const closeCard = () => {
    setSelectedItem(null);
  };

  const downloadPDF = () => {
    if (!roadmap || roadmap.length === 0) {
      alert('No roadmap data available to download');
      return;
    }

    // Create a comprehensive PDF content
    const pdfContent = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #f97316; padding-bottom: 20px;">
          <h1 style="color: #1f2937; font-size: 32px; margin-bottom: 10px;">Learning Roadmap</h1>
          <p style="color: #6b7280; font-size: 16px;">Your Personalized Learning Journey</p>
          <p style="color: #9ca3af; font-size: 14px;">Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        
        ${roadmap.map((stage, index) => `
          <div style="margin-bottom: 35px; padding: 25px; border-left: 5px solid ${roadmapItems[index]?.color.includes('yellow') ? '#eab308' : 
            roadmapItems[index]?.color.includes('purple') ? '#7c3aed' :
            roadmapItems[index]?.color.includes('blue') ? '#2563eb' :
            roadmapItems[index]?.color.includes('orange') ? '#ea580c' :
            roadmapItems[index]?.color.includes('green') ? '#059669' : '#dc2626'}; background: #f9fafb; border-radius: 8px;">
            
            <div style="display: flex; align-items: center; margin-bottom: 15px;">
              <div style="width: 40px; height: 40px; background: ${roadmapItems[index]?.color.includes('yellow') ? '#eab308' : 
                roadmapItems[index]?.color.includes('purple') ? '#7c3aed' :
                roadmapItems[index]?.color.includes('blue') ? '#2563eb' :
                roadmapItems[index]?.color.includes('orange') ? '#ea580c' :
                roadmapItems[index]?.color.includes('green') ? '#059669' : '#dc2626'}; 
                color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; 
                font-weight: bold; margin-right: 15px; font-size: 18px;">
                ${getStageNumber(index)}
              </div>
              <div>
                <h2 style="color: #1f2937; font-size: 24px; margin: 0; font-weight: bold;">${stage?.stage || `Stage ${index + 1}`}</h2>
                <h3 style="color: #4b5563; font-size: 18px; margin: 5px 0 0 0; font-weight: 600;">${stage?.heading || 'Stage Heading'}</h3>
              </div>
            </div>
            
            <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">${stage?.description || 'No description available'}</p>
            
            <h4 style="color: #1f2937; font-size: 18px; margin-bottom: 15px; font-weight: bold;">Technologies & Topics:</h4>
            
            ${Array.isArray(stage?.techStack) ? stage.techStack.map(tech => `
              <div style="margin-bottom: 20px; padding: 15px; background: white; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <h5 style="color: #1f2937; font-size: 16px; font-weight: bold; margin: 0 0 10px 0;">${tech?.name || 'Technology'}</h5>
                <ul style="margin: 0; padding-left: 20px; color: #4b5563;">
                  ${Array.isArray(tech?.topics) ? tech.topics.map(topic => `<li style="margin-bottom: 5px;">${topic}</li>`).join('') : '<li>No topics available</li>'}
                </ul>
              </div>
            `).join('') : '<p style="color: #6b7280;">No tech stack information available</p>'}
          </div>
        `).join('')}
        
        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; color: #9ca3af; font-size: 12px;">
          <p>Generated by Learning Roadmap Generator</p>
        </div>
      </div>
    `;

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Learning Roadmap</title>
            <style>
              body { margin: 0; padding: 0; }
              @media print {
                body { -webkit-print-color-adjust: exact; }
              }
            </style>
          </head>
          <body>
            ${pdfContent}
          </body>
        </html>
      `);
      
      printWindow.document.close();
      
      // Trigger print dialog
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    } else {
      alert('Unable to open print window. Please check your popup blocker settings.');
    }
  };

  if (!roadmap || roadmap.length === 0) {
    return <div className="text-center text-gray-500">No roadmap data available</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <div className="w-8 h-8 bg-orange-500 rounded-full mr-3"></div>
          <h1 className="text-sm font-semibold text-gray-600 tracking-wide">LEARNING ROADMAP</h1>
        </div>
        <h2 className="text-4xl font-bold text-gray-800 mb-2">YOUR PERSONALIZED</h2>
        <h3 className="text-4xl font-bold text-gray-800 mb-6">LEARNING JOURNEY</h3>
        
        {/* Download Button */}
        <button
          onClick={downloadPDF}
          className="inline-flex items-center px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors duration-200 shadow-lg hover:shadow-xl"
        >
          <Download size={20} className="mr-2" />
          Download PDF
        </button>
      </div>

      {/* Roadmap Container */}
      <div className="relative w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-visible" 
           style={{ 
             minHeight: '600px',
             height: `${Math.max(600, roadmapItems.length * 150 + 100)}px`
           }}>
        {/* SVG Path */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path 
            d={createPath()} 
            stroke="#d1d5db" 
            strokeWidth="0.3" 
            fill="none" 
            className="drop-shadow-sm" 
          />
        </svg>

        {/* Roadmap Items */}
        {roadmapItems.map((item, index) => (
          <div
            key={item.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 hover:scale-105 flex items-center w-full"
            style={{ 
              top: item.position.top, 
              left: item.position.left,
              zIndex: 10
            }}
            onClick={() => handleDotClick(item)}
          >
            {/* Left side content for even indices, right side for odd */}
            {index % 2 === 0 ? (
              <>
                {/* Heading on the left */}
                <div className="mr-8 text-right flex-1 max-w-md pr-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-1 leading-tight">{item.heading}</h3>
                  <span className="text-sm font-medium text-gray-600 block">{item.title}</span>
                </div>
                {/* Number circle */}
                <div className={`w-16 h-16 ${item.color} rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 flex-shrink-0`}>
                  <span className="text-white font-bold text-xl">
                    {getStageNumber(index)}
                  </span>
                </div>
                {/* Empty space for balance */}
                <div className="flex-1 max-w-md"></div>
              </>
            ) : (
              <>
                {/* Empty space for balance */}
                <div className="flex-1 max-w-md"></div>
                {/* Number circle */}
                <div className={`w-16 h-16 ${item.color} rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 flex-shrink-0`}>
                  <span className="text-white font-bold text-xl">
                    {getStageNumber(index)}
                  </span>
                </div>
                {/* Heading on the right */}
                <div className="ml-8 text-left flex-1 max-w-md pl-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-1 leading-tight">{item.heading}</h3>
                  <span className="text-sm font-medium text-gray-600 block">{item.title}</span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Card Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 transform transition-all duration-300 scale-100 max-h-[75vh] flex flex-col">
            {/* Card Header - Fixed */}
            <div className={`${selectedItem.color} p-6 rounded-t-2xl relative flex-shrink-0`}>
              <button
                onClick={closeCard}
                className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
              >
                <X size={20} />
              </button>
              <h3 className="text-2xl font-bold text-white mb-2">{selectedItem.title}</h3>
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-content-center">
                <span className="text-white text-xl font-bold">
                  {getStageNumber(selectedItem.originalIndex || roadmapItems.indexOf(selectedItem))}
                </span>
              </div>
            </div>

            {/* Card Content - Scrollable */}
            <div className="p-6 flex-1 overflow-y-auto">
              <h4 className="text-xl font-bold text-gray-800 mb-3">
                {selectedItem.heading}
              </h4>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {selectedItem.description}
              </p>
              
              <h4 className="font-semibold text-gray-800 mb-3">Technologies & Topics:</h4>
              <div className="space-y-3">
                {selectedItem.techStack && selectedItem.techStack.length > 0 ? (
                  selectedItem.techStack.map((tech, index) => (
                    <div key={index} className="border-l-4 border-gray-200 pl-4">
                      <div className="font-semibold text-gray-800 mb-2">{tech?.name || 'Technology'}</div>
                      <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 ml-2">
                        {tech?.topics && Array.isArray(tech.topics) && tech.topics.length > 0 ? (
                          tech.topics.map((topic, topicIndex) => (
                            <li key={topicIndex}>{topic}</li>
                          ))
                        ) : (
                          <li>No topics available</li>
                        )}
                      </ul>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 italic">No tech stack information available</div>
                )}
              </div>
            </div>

            {/* Card Footer - Fixed */}
            <div className="p-6 pt-4 border-t border-gray-100 flex-shrink-0">
              <button
                onClick={closeCard}
                className={`w-full ${selectedItem.color} text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity`}
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}