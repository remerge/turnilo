/*
 * Copyright 2017-2018 Allegro.pl
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as React from "react";
import { DragEvent, MouseEvent } from "react";
import { classNames } from "../../utils/dom/dom";
import { HighlightString } from "../highlight-string/highlight-string";
import { InfoBubble } from "../info-bubble/info-bubble";
import { SvgIcon } from "../svg-icon/svg-icon";
import "./measure-item.scss";
import { MeasureClickHandler, MeasureDragStartHandler } from "./measures-tile";

export const MEASURE_CLASS_NAME = "measure-item";

export interface MeasureItemProps {
  name: string;
  title: string;
  approximate: boolean;
  description?: string;
  selected: boolean;
  measureClick: MeasureClickHandler;
  measureDragStart: MeasureDragStartHandler;
  searchText: string;
  highlighted: boolean;
}

export const MeasureItem: React.SFC<MeasureItemProps> = ({ title, name, measureDragStart, measureClick, description, searchText, approximate, selected, highlighted }) => {

  const infoBubbleClassName = "measure-info-icon";
  const handleClick = (e: MouseEvent<HTMLElement>) => {
    const target = e.target as Element;
    if (target.classList && target.classList.contains(infoBubbleClassName)) return;
    measureClick(name, e);
  };

  const handleDragStart = (e: DragEvent<HTMLElement>) => {
    measureDragStart(name, e);
  };

  return <div
    className={classNames(MEASURE_CLASS_NAME, "row", { selected, highlighted })}
    onClick={handleClick}
    draggable={true}
    onDragStart={handleDragStart}>
    <div className="measure-item-name">
      <HighlightString className="label measure-item-label" text={title} highlight={searchText} />
      {approximate && <SvgIcon className="approximate-measure-icon" svg={require("../../icons/approx.svg")} />}
    </div>
    {description && <InfoBubble className={infoBubbleClassName} description={description} />}
  </div>;
};
