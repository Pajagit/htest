import React from "react";
import { Link } from "react-router-dom";

import UnderlineAnchor from "../common/UnderlineAnchor";
import humedsImg from "../../img/humeds-logo.png";
import hrmImg from "../../img/hrm-logo.png";
import gardenizeImg from "../../img/gardenize-logo.png";
import projectPlaceholderImg from "../../img/project-placeholder.png";

function ProjectTableList() {
  return (
    <div className=" project-list-container project-list-container-list">
      <table className="project-list-container-list-table">
        <tbody>
          <tr>
            <td className="project-list-container-list-table--header">Name of Project</td>
            <td className="project-list-container-list-table--header">Management</td>
            <td className="project-list-container-list-table--header">Type</td>
            <td className="project-list-container-list-table--header">QA</td>
            <td className="project-list-container-list-table--header">Details</td>
          </tr>
          <tr>
            <td className="project-list-container-list-table--value">
              <Link to={"/1/TestCases"}>
                <div className="project-list-container-list-table--value-title">
                  <div className="project-list-container-list-table--value-title--img">
                    <img src={humedsImg} alt="Humeds" />
                  </div>
                  <div className="project-list-container-list-table--value-title--name">Humeds</div>
                </div>
              </Link>
            </td>
            <td className="project-list-container-list-table--value">Srdjan Jovanovic</td>
            <td className="project-list-container-list-table--value">Web and Mobile</td>
            <td className="project-list-container-list-table--value">Milos Najdanovic</td>
            <td className="project-list-container-list-table--value">
              <UnderlineAnchor value={"Details"} link={`/1/ProjectDetails`} />
            </td>
          </tr>
          <tr>
            <td className="project-list-container-list-table--value">
              <Link to={"/1/TestCases"}>
                <div className="project-list-container-list-table--value-title">
                  <div className="project-list-container-list-table--value-title--img">
                    <img src={projectPlaceholderImg} alt="Verso" />
                  </div>
                  <div className="project-list-container-list-table--value-title--name">Verso</div>
                </div>
              </Link>
            </td>
            <td className="project-list-container-list-table--value">Predrag Pivarski</td>
            <td className="project-list-container-list-table--value">Web</td>
            <td className="project-list-container-list-table--value">Radmila Petrovic</td>
            <td className="project-list-container-list-table--value">
              <UnderlineAnchor value={"Details"} link={`/1/ProjectDetails`} />
            </td>
          </tr>
          <tr>
            <td className="project-list-container-list-table--value">
              <Link to={"/1/TestCases"}>
                <div className="project-list-container-list-table--value-title">
                  <div className="project-list-container-list-table--value-title--img">
                    <img src={gardenizeImg} alt="Gardenize" />
                  </div>
                  <div className="project-list-container-list-table--value-title--name">Gardenize</div>
                </div>
              </Link>
            </td>
            <td className="project-list-container-list-table--value">Milan Pasic</td>
            <td className="project-list-container-list-table--value">Mobile</td>
            <td className="project-list-container-list-table--value">Milos Radic</td>
            <td className="project-list-container-list-table--value">
              <UnderlineAnchor value={"Details"} link={`/1/ProjectDetails`} />
            </td>
          </tr>
          <tr className="disabled">
            <td className="project-list-container-list-table--value ">
              <Link to={"/1/TestCases"}>
                <div className="project-list-container-list-table--value-title">
                  <div className="project-list-container-list-table--value-title--img">
                    <img src={projectPlaceholderImg} alt="Stena Command Center" />
                  </div>
                  <div className="project-list-container-list-table--value-title--name">Stena Command Center</div>
                </div>
              </Link>
            </td>
            <td className="project-list-container-list-table--value">Stefan Mrsic</td>
            <td className="project-list-container-list-table--value">Web and Mobile</td>
            <td className="project-list-container-list-table--value">
              Aleksandar Pavlovic,
              <br />
              Jana Antic
            </td>
            <td className="project-list-container-list-table--value">
              <UnderlineAnchor value={"Details"} link={`/1/ProjectDetails`} />
            </td>
          </tr>
          <tr>
            <td className="project-list-container-list-table--value">
              <Link to={"/1/TestCases"}>
                <div className="project-list-container-list-table--value-title">
                  <div className="project-list-container-list-table--value-title--img">
                    <img src={hrmImg} alt="HRM" />
                  </div>
                  <div className="project-list-container-list-table--value-title--name">HRM</div>
                </div>
              </Link>
            </td>
            <td className="project-list-container-list-table--value">Nikola Aleksic</td>
            <td className="project-list-container-list-table--value">Web and Mobile</td>
            <td className="project-list-container-list-table--value">Uros Jeremic</td>
            <td className="project-list-container-list-table--value">
              <UnderlineAnchor value={"Details"} link={`/1/ProjectDetails`} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
export default ProjectTableList;
