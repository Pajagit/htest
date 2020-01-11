import React from "react";
// import Checkbox from "./Checkbox";
import ListItemCheckbox from "../lists/ListItemCheckbox";

function SetupProperty({ setupProperties }) {
  var content;
  content = setupProperties.map((setupProperty, index) => (
    <ListItemCheckbox
      key={index}
      title={setupProperty.title}
      checkboxText='Used on project'
      // img={project.image_url ? project.image_url : projectImagePlaceholder}
      // link={`/EditProject/${project.id}`}
      // list={project.users.map((user, index) => (
      //   <React.Fragment key={index}>
      //     {user.first_name ? user.first_name + " " + user.last_name : user.email}
      //     {project.users.length - 1 > index ? `, ` : ``}
      //   </React.Fragment>
      // ))}
    />
  ));
  return <div className='list-item-container'>{content}</div>;
}

export default SetupProperty;
