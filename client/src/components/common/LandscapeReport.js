import React from "react";
// import moment from "moment";
import ReportStatus from "./ReportStatus";
import Tag from "./Tag";

function LandscapeTestCase({ title, tags, author, date, description, id, projectId, onClick }) {
    return (
        <div className="landscape-report clickable" onClick={onClick}>
            <div className="landscape-report-left">
                <div className="landscape-report-left-container">
                    <div className="landscape-report-left-container--title">Title</div>

                    <div className="landscape-report-left-container--tags">
                        <Tag title="Login" color="DARK_KHAKI" isRemovable={false} />
                        <Tag title="Regression" color="MEDIUM_SEA_GREEN" isRemovable={false} />
                    </div>

                    <div className="landscape-report-left-container--author">
                        Aleksandar Pavlovic, QA
          </div>
                    <div className="landscape-report-left-container--date">
                        9th January 2020, 9:06:32 pm
          </div>
                    <div className="landscape-report-left-container--button">
                        <ReportStatus status={"passed"} id={id} />
                    </div>
                </div>
            </div>

            <div className="landscape-report-right">
                <div className="landscape-report-right-left-container">
                    <div className="landscape-report-right-left-container--item">
                        <div className="landscape-report-right-left-container--item-title">Device:</div>
                        <div className="landscape-report-right-left-container--item-value">Samsung Galaxy A7</div>
                    </div>
                    <div className="landscape-report-right-left-container--item">
                        <div className="landscape-report-right-left-container--item-title">Browser:</div>
                        <div className="landscape-report-right-left-container--item-value">Google Chrome</div>
                    </div>
                    <div className="landscape-report-right-left-container--item">
                        <div className="landscape-report-right-left-container--item-title">Version:</div>
                        <div className="landscape-report-right-left-container--item-value">Version 2.1</div>
                    </div>
                    <div className="landscape-report-right-left-container--item">
                        <div className="landscape-report-right-left-container--item-title">Operating System:</div>
                        <div className="landscape-report-right-left-container--item-value">Android</div>
                    </div>
                </div>
            </div>
            <div className="landscape-report-right">
                <div className="landscape-report-right-right-container">
                    <div className="landscape-report-right-right-container--item">
                        <div className="landscape-report-right-right-container--item-title">Environment:</div>
                        <div className="landscape-report-right-right-container--item-value">Development</div>
                    </div>
                    <div className="landscape-report-right-right-container--item">
                        <div className="landscape-report-right-right-container--item-title">Comment:</div>
                        <div className="landscape-report-right-right-container--item-value">Additional comment goes here</div>
                    </div>
                    <div className="landscape-report-right-right-container--item">
                        <div className="landscape-report-right-right-container--item-title">Actual Result:</div>
                        <div className="landscape-report-right-right-container--item-value">Actual result goes here</div>
                    </div>
                    <div className="landscape-report-right-right-container--item">
                        <div className="landscape-report-right-right-container--item-title">Simulator:</div>
                        <div className="landscape-report-right-right-container--item-value">iPhone 7</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LandscapeTestCase;
