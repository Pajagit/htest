import React from "react";
import FullBtn from "../../components/common/FullBtn";
import Dropdown from "../../components/common/Dropdown";

function DropdownGroup({ primary, primaryTitle, secondaryTitle, secondary, validationMsg }) {
  return (
    <div>
      <h2>Select project and role below</h2>
      <Dropdown
        key={1}
        placeholder="Pick Users' Project Role"
        value={"test"}
        onChange={e => this.onChange(e)}
        validationMsg={validationMsg}
        name={"role"}
        label={primaryTitle}
        options={primary.map((item, index) => ({ id: item.id, title: item.title }))}
      />
      <Dropdown
        key={2}
        placeholder="Pick Users' Project Role"
        value={"test"}
        onChange={e => this.onChange(e)}
        validationMsg={validationMsg}
        name={"role"}
        label={secondaryTitle}
        options={secondary.map((item, index) => ({ id: item.id, title: item.title }))}
      />

      <FullBtn placeholder="Add New Project" />
    </div>
  );
}
export default DropdownGroup;
