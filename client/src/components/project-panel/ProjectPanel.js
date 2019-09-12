import React, { useState, useEffect } from "react";
import ProjectPanelItem from "./ProjectPanelItem";
import ProjectPanelHeader from "./ProjectPanelHeader";
import humedsLogo from "../../img/humeds-logo.png";
import htecLogo from "../../img/htec-logo.png";

function ProjectPanel(props) {
  const [project, setProject] = useState([]);
  useEffect(() => {
    if (props.projectId === "1") {
      setProject({
        title: "HUMEDS",
        img: humedsLogo,
        projectId: 1
      });
    } else if (props.projectId === "2") {
      setProject({
        project: {
          title: "HTEC",
          img: htecLogo,
          projectId: 2
        }
      });
    }
  }, [props]);
  return (
    <div className="project-panel project-panel-grid">
      <div className="project-panel-items">
        <ProjectPanelHeader img={project.img} alt={project.title} title={project.title} />
        <ProjectPanelItem
          icon={<i className="fas fa-clipboard-list"></i>}
          title={"TEST CASES"}
          active={true}
          link={`/${project.projectId}/TestCases`}
        />
        <ProjectPanelItem
          icon={<i className="fas fa-file-alt"></i>}
          title={"REPORTS"}
          active={false}
          link={`/${project.projectId}/Reports`}
        />
        <ProjectPanelItem
          icon={<i className="far fa-chart-bar"></i>}
          title={"STATISTIC"}
          active={false}
          link={`/${project.projectId}/Statistic`}
        />
        <ProjectPanelItem
          icon={<i className="fas fa-cog"></i>}
          title={"SETTINGS"}
          active={false}
          link={`/${project.projectId}/Settings`}
        />
      </div>
    </div>
  );
}

export default ProjectPanel;
