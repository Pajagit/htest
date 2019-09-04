import React, { Component } from "react";
import PortraitTestCase from "../common/PortraitTestCase";
import Tag from "../common/Tag";

class TestCaseContainer extends Component {
  render() {
    var tags = [];
    tags.push(
      <Tag title={"Health Check"} color={"blue"} isRemovable={false} />,
      <Tag
        title={"Aleksandar Pavlovic"}
        color={"dark-pink"}
        isRemovable={false}
      />
    );

    var tags2 = [];
    tags2.push(
      <Tag title={"Regression"} color={"purple"} isRemovable={false} />,
      <Tag
        title={"Aleksandar Pavlovic"}
        color={"dark-pink"}
        isRemovable={false}
      />,
      <Tag title={"Health Check"} color={"blue"} isRemovable={false} />,
      <Tag title={"Login"} color={"dark-blue"} isRemovable={false} />
    );

    var tags3 = [];
    tags3.push(
      <Tag title={"Regression"} color={"purple"} isRemovable={false} />,
      <Tag
        title={"Aleksandar Pavlovic"}
        color={"dark-pink"}
        isRemovable={false}
      />,
      <Tag title={"Health Check"} color={"blue"} isRemovable={false} />,
      <Tag title={"Login"} color={"dark-blue"} isRemovable={false} />,
      <Tag title={"Registration"} color={"dark-golden"} isRemovable={false} />
    );

    var tags4 = [];
    tags4.push(
      <Tag title={"Regression"} color={"purple"} isRemovable={false} />,
      <Tag
        title={"Aleksandar Pavlovic"}
        color={"dark-pink"}
        isRemovable={false}
      />,
      <Tag title={"Health Check"} color={"blue"} isRemovable={true} />,
      <Tag title={"Login"} color={"dark-blue"} isRemovable={false} />,
      <Tag title={"Registration"} color={"dark-golden"} isRemovable={false} />,
      <Tag title={"Position List"} color={"dark-orchid"} isRemovable={false} />
    );

    var tags5 = [];
    tags5.push(
      <Tag title={"Regression"} color={"purple"} isRemovable={false} />,
      <Tag
        title={"Aleksandar Pavlovic"}
        color={"dark-pink"}
        isRemovable={false}
      />,
      <Tag title={"Health Check"} color={"blue"} isRemovable={false} />,
      <Tag title={"Login"} color={"dark-blue"} isRemovable={false} />,
      <Tag title={"Registration"} color={"dark-golden"} isRemovable={false} />,
      <Tag title={"Position List"} color={"dark-orchid"} isRemovable={false} />,
      <Tag title={"Voyage Report"} color={"dark-gray"} isRemovable={false} />
    );

    var tags6 = [];
    tags6.push(
      <Tag title={"Regression"} color={"purple"} isRemovable={false} />,
      <Tag
        title={"Aleksandar Pavlovic"}
        color={"dark-pink"}
        isRemovable={false}
      />,
      <Tag title={"Health Check"} color={"blue"} isRemovable={false} />,
      <Tag title={"Login"} color={"dark-blue"} isRemovable={false} />,
      <Tag title={"Registration"} color={"dark-golden"} isRemovable={false} />,
      <Tag title={"Position List"} color={"dark-orchid"} isRemovable={false} />,
      <Tag title={"Voyage Report"} color={"dark-gray"} isRemovable={false} />,
      <Tag
        title={"Distance Calculator"}
        color={"dark-red"}
        isRemovable={false}
      />
    );

    return (
      <div className="testcase-grid testcase-container">
        <PortraitTestCase
          title={"Check the required field by no filling lorem ipsum"}
          tags={tags}
          author={"Aleksandar Pavlovic"}
          date={"30. July, 2019"}
          description={
            "First of all, I try to have an approximate idea of the concept with daily watches on similar products to this app concept and I imagine a mix of several apps."
          }
        />
        <PortraitTestCase
          title={"Check the required field by no filling lorem ipsum"}
          tags={tags2}
          author={"Aleksandar Pavlovic"}
          date={"30. July, 2019"}
          description={
            "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. "
          }
        />
        <PortraitTestCase
          title={"Check the required field by no filling lorem ipsum"}
          tags={tags3}
          author={"Aleksandar Pavlovic"}
          date={"30. July, 2019"}
          description={
            "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. "
          }
        />
        <PortraitTestCase
          title={"Check the required field by no filling lorem ipsum"}
          tags={tags4}
          author={"Aleksandar Pavlovic"}
          date={"30. July, 2019"}
          description={
            "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. "
          }
        />
        <PortraitTestCase
          title={"Check the required field by no filling lorem ipsum"}
          tags={tags5}
          author={"Aleksandar Pavlovic"}
          date={"30. July, 2019"}
          description={
            "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. "
          }
        />
        <PortraitTestCase
          title={"Check the required field by no filling lorem ipsum"}
          tags={tags6}
          author={"Aleksandar Pavlovic"}
          date={"30. July, 2019"}
          description={
            "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. "
          }
        />
        <PortraitTestCase
          title={"Check the required field by no filling lorem ipsum"}
          tags={tags2}
          author={"Aleksandar Pavlovic"}
          date={"30. July, 2019"}
          description={
            "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. "
          }
        />
        <PortraitTestCase
          title={"Check the required field by no filling lorem ipsum"}
          tags={tags2}
          author={"Aleksandar Pavlovic"}
          date={"30. July, 2019"}
          description={
            "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. "
          }
        />
        <PortraitTestCase
          title={"Check the required field by no filling lorem ipsum"}
          tags={tags3}
          author={"Aleksandar Pavlovic"}
          date={"30. July, 2019"}
          description={
            "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. "
          }
        />
        <PortraitTestCase
          title={"Check the required field by no filling lorem ipsum"}
          tags={tags4}
          author={"Aleksandar Pavlovic"}
          date={"30. July, 2019"}
          description={
            "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. "
          }
        />
        <PortraitTestCase
          title={"Check the required field by no filling lorem ipsum"}
          tags={tags5}
          author={"Aleksandar Pavlovic"}
          date={"30. July, 2019"}
          description={
            "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. "
          }
        />
        <PortraitTestCase
          title={"Check the required field by no filling lorem ipsum"}
          tags={tags6}
          author={"Aleksandar Pavlovic"}
          date={"30. July, 2019"}
          description={
            "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. "
          }
        />
        <PortraitTestCase
          title={"Check the required field by no filling lorem ipsum"}
          tags={tags2}
          author={"Aleksandar Pavlovic"}
          date={"30. July, 2019"}
          description={
            "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. "
          }
        />
        <PortraitTestCase
          title={"Check the required field by no filling lorem ipsum"}
          tags={tags2}
          author={"Aleksandar Pavlovic"}
          date={"30. July, 2019"}
          description={
            "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. "
          }
        />
        <PortraitTestCase
          title={"Check the required field by no filling lorem ipsum"}
          tags={tags3}
          author={"Aleksandar Pavlovic"}
          date={"30. July, 2019"}
          description={
            "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. "
          }
        />
      </div>
    );
  }
}

export default TestCaseContainer;
