import { useEffect, useState } from "react";
import { Calendar, FileText, Code, User, Clock } from "lucide-react"; 
import "../styles/radial.css";

export default function RadialOrbitalTimeline({ timelineData }) {
  const [expandedId, setExpandedId] = useState(null);
  const [angle, setAngle] = useState(0);
  const [showCard, setShowCard] = useState(false);
  const [positionSwap, setPositionSwap] = useState(null);
  const [animationPhase, setAnimationPhase] = useState('normal'); 

 // Constant radius for all nodes

 
  const getTopNodeIndex = (total, currentAngle) => {
    const topAngle = -90;
    const normalizedAngle = (currentAngle % 360 + 360) % 360;
    const targetAngle = (topAngle - normalizedAngle + 360) % 360;
    
    let closestIndex = 0;
    let minDiff = Infinity;
    
    for (let i = 0; i < total; i++) {
      const nodeAngle = (i / total) * 360;
      const diff = Math.abs(nodeAngle - targetAngle);
      const diff2 = Math.abs(nodeAngle - (targetAngle + 360));
      const minNodeDiff = Math.min(diff, diff2);
      
      if (minNodeDiff < minDiff) {
        minDiff = minNodeDiff;
        closestIndex = i;
      }
    }
    
    return closestIndex;
  };

  useEffect(() => {

    if (expandedId) {
      return;
    }
    
    const timer = setInterval(() => {
      setAngle((p) => (p + 0.2) % 360);
    }, 50);
    return () => clearInterval(timer);
  }, [expandedId]);

  useEffect(() => {
    if (expandedId && timelineData) {
      
      const currentAngle = angle;
      
    
      setAnimationPhase('converging');
      
    
      const rearrangeTimer = setTimeout(() => {
        setAnimationPhase('rearranging');
        const topIndex = getTopNodeIndex(timelineData.length, currentAngle);
        const clickedIndex = timelineData.findIndex(item => item.id === expandedId);
        setPositionSwap({ clickedIndex, topIndex });
      }, 600);
      

      const cardTimer = setTimeout(() => {
        setShowCard(true);
      }, 1200); 
      
      return () => {
        clearTimeout(rearrangeTimer);
        clearTimeout(cardTimer);
      };
    } else {
      setShowCard(false);
      setPositionSwap(null);
      setAnimationPhase('normal');
    }
  
  }, [expandedId, timelineData]);

  const handleNodeClick = (itemId, clickedIndex) => {
    if (expandedId === itemId) {
      setExpandedId(null);
    } else {
      setExpandedId(itemId);
    }
  };

  const RADIUS = 265; 

  const calculatePosition = (index, total, isExpanded, itemId) => {
  
    if (animationPhase === 'converging') {
      const currentPos = calculateNormalPosition(index, total);
  
      const convergeRadius = 50;
      const angle = Math.atan2(currentPos.y, currentPos.x);
      return {
        x: Math.cos(angle) * convergeRadius,
        y: Math.sin(angle) * convergeRadius
      };
    }
    
    
    if (isExpanded && animationPhase !== 'converging') {
     
      return { x: 0, y: -RADIUS };
    }
    
 
    if (positionSwap && animationPhase === 'rearranging') {
      let actualIndex = index;
      if (index === positionSwap.clickedIndex) {
        actualIndex = positionSwap.topIndex;
      } else if (index === positionSwap.topIndex) {
        actualIndex = positionSwap.clickedIndex;
      }
      
      const angleStep = 360 / total;
      const baseAngle = actualIndex * angleStep;
      const a = (baseAngle + angle) * (Math.PI / 180);
      
      
      return { 
        x: Math.cos(a) * RADIUS, 
        y: Math.sin(a) * RADIUS 
      };
    }
    
    
    return calculateNormalPosition(index, total);
  };

  const calculateNormalPosition = (index, total) => {
    const angleStep = 360 / total;
    const baseAngle = index * angleStep;
    const a = (baseAngle + angle) * (Math.PI / 180);
    
    
    return { 
      x: Math.cos(a) * RADIUS, 
      y: Math.sin(a) * RADIUS 
    };
  };

  const iconMap = {
    Planning: Calendar,
    Design: FileText,
    Development: Code,
    Testing: User,
    Release: Clock,
  };

  if (!timelineData || timelineData.length === 0) {
    return (
      <div className="timeline-container">
        <div className="orbit">
          <div className="center-core"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="timeline-container">
      <div className="orbit">
        <div className="center-core"></div>

        {timelineData.map((item, index) => {
          const expanded = expandedId === item.id;
          const pos = calculatePosition(index, timelineData.length, expanded, item.id);

          const Icon = item.icon || iconMap[item.title] || Clock;

          return (
            <div
              key={item.id}
              className={`node ${expanded ? "expanded" : ""} ${animationPhase}`}
              style={{
                "--x": `${pos.x}px`,
                "--y": `${pos.y}px`,
                transform: `translate(-50%, -50%) translate(${pos.x}px, ${pos.y}px)`
              }}
              onClick={() => handleNodeClick(item.id, index)}
            >
              <div className="icon">
                <Icon size={22} />
              </div>

              <div className="label">{item.title}</div>

              {expanded && showCard && (
                <div className="card">
                  <div className="badge">{item.status}</div>
                  <p>{item.date}</p>
                  <p>{item.content}</p>

                  <div className="progress">
                    <div
                      className="progress-bar"
                      style={{ width: `${item.energy}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}


