import React from "react";
import FullBtn from "../../components/common/FullBtn";
import DropdownRemove from "../../components/common/DropdownRemove";

function DropdownRemoveGroup({ primary, secondary, validationMsg }) {
  return (
    <div>
      {primary.map((item, index) => (
        <DropdownRemove
          key={index}
          placeholder="Pick Users' Project Role"
          value={item.id}
          onChange={e => this.onChange(e)}
          validationMsg={validationMsg}
          name={"role"}
          label={item.title}
          options={secondary}
        />
      ))}

      {/* <FullBtn placeholder="Add New Project" /> */}
    </div>
  );
}
export default DropdownRemoveGroup;
