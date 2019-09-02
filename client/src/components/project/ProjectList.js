import React from "react";

function ProjectList() {
  return (
    <div className=" project-container project-container-list">
      <table class="project-container-list-table">
        <tr>
          <td class="project-container-list-table--header">Name of Project</td>
          <td class="project-container-list-table--header">Management</td>
          <td class="project-container-list-table--header">Url to Project</td>
          <td class="project-container-list-table--header">Type of Project</td>
          <td class="project-container-list-table--header">QA List</td>
          <td class="project-container-list-table--header">Latest Activity</td>
          <td class="project-container-list-table--header">Url to Jira</td>
        </tr>
        <tr>
          <td class="project-container-list-table--value">Humeds</td>
          <td class="project-container-list-table--value">Srdjan Jovanovic</td>
          <td class="project-container-list-table--value">
            https://linktoproject.com
          </td>
          <td class="project-container-list-table--value">Web and Mobile</td>
          <td class="project-container-list-table--value">Milos Najdanovic</td>
          <td class="project-container-list-table--value">
            Added new Test Case, <br />
            23 minutes ago
          </td>
          <td class="project-container-list-table--value">
            http://urltojira.com
          </td>
        </tr>
        <tr>
          <td class="project-container-list-table--value">Verson</td>
          <td class="project-container-list-table--value">Predrag Pivarski</td>
          <td class="project-container-list-table--value">
            https://linktoproject.com
          </td>
          <td class="project-container-list-table--value">Web</td>
          <td class="project-container-list-table--value">Radmila Petrovic</td>
          <td class="project-container-list-table--value">
            Added new Group,
            <br />
            46 minutes ago
          </td>
          <td class="project-container-list-table--value">
            http://urltojira.com
          </td>
        </tr>
        <tr>
          <td class="project-container-list-table--value">Gardenize</td>
          <td class="project-container-list-table--value">Milan Pasic</td>
          <td class="project-container-list-table--value">
            https://linktoproject.com
          </td>
          <td class="project-container-list-table--value">Mobile</td>
          <td class="project-container-list-table--value">Milos Radic</td>
          <td class="project-container-list-table--value">
            Created new Report,
            <br />
            about 1 hour ago
          </td>
          <td class="project-container-list-table--value">
            http://urltojira.com
          </td>
        </tr>
        <tr>
          <td class="project-container-list-table--value">
            Stena Command Centar
          </td>
          <td class="project-container-list-table--value">Stefan Mrsic</td>
          <td class="project-container-list-table--value">
            https://linktoproject.com
          </td>
          <td class="project-container-list-table--value">Web and Mobile</td>
          <td class="project-container-list-table--value">
            Aleksandar Pavlovic,
            <br />
            Jana Antic
          </td>
          <td class="project-container-list-table--value">
            Added new Test Case,
            <br />2 days ago
          </td>
          <td class="project-container-list-table--value">
            http://urltojira.com
          </td>
        </tr>
        <tr>
          <td class="project-container-list-table--value">HRM</td>
          <td class="project-container-list-table--value">Nikola Aleksic</td>
          <td class="project-container-list-table--value">
            https://linktoproject.com
          </td>
          <td class="project-container-list-table--value">Web and Mobile</td>
          <td class="project-container-list-table--value">Uros Jeremic</td>
          <td class="project-container-list-table--value">
            Added new Test Case,
            <br />a week ago
          </td>
          <td class="project-container-list-table--value">
            http://urltojira.com
          </td>
        </tr>
      </table>
    </div>
  );
}
export default ProjectList;
