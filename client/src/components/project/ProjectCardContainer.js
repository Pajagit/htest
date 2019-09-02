import React from "react";
import ProjectCard from "./ProjectCard";
import stenaBulk from "../../img/stena-bulk.jpg";
import hrmImg from "../../img/hrm-logo.png";
import quinyx from "../../img/quinyx.jpg";
import gardenizeImg from "../../img/gardenize-logo.png";

export default function ProjectContainer() {
  return (
    <div className="project-card-container">
      <div className="project-card-container-title">Recently Viewed</div>
      <div className="project-card-container-items">
        <ProjectCard
          img={stenaBulk}
          title={"StenaMI"}
          management={"Management: Slavisa Djokic, Gabriela Mate"}
          qa={"QA: Aleksandar Pavlovic, Jana Antic, Sandra Jeremenkovic"}
        />
        <ProjectCard
          img={quinyx}
          title={"Quinyx"}
          management={"Management: Milos Ignjatovic"}
          qa={"QA: Milos Najdanovic, Maja Georgijevski, Kristijan Ristic"}
        />
        <ProjectCard img={hrmImg} title={"HRM"} management={"Management: Nikola Aleksic"} qa={"https://hrm.htec.rs"} />
        <ProjectCard
          img={gardenizeImg}
          title={"Gardenize"}
          management={"Management: Pojma nemam"}
          qa={"https://gardenize.com"}
        />
      </div>
    </div>
  );
}
