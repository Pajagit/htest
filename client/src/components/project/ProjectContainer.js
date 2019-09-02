import React from "react";
import Project from "./Project";
import stenaBulk from "../../img/stena-bulk.jpg";
import quinyx from "../../img/quinyx.jpg";

export default function ProjectContainer() {
  return (
    <div className="testcase-grid project-container">
      <Project
        img={stenaBulk}
        title={"StenaMI"}
        management={"Management: Slavisa Djokic, Gabriela Mate"}
        url={"https://stena-bulk.com"}
      />
      <Project
        img={quinyx}
        title={"Quinyx"}
        management={"Management: Milos Ignjatovic"}
        url={"https://quinyx.com"}
      />
      <Project
        img={stenaBulk}
        title={"StenaMI"}
        management={"Management: Slavisa Djokic, Gabriela Mate"}
        url={"https://stena-bulk.com"}
      />{" "}
      <Project
        img={stenaBulk}
        title={"StenaMI"}
        management={"Management: Slavisa Djokic, Gabriela Mate"}
        url={"https://stena-bulk.com"}
      />{" "}
    </div>
  );
}
