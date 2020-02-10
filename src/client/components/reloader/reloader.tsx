
/*
 * Copyright 2015-2016 Imply Data, Inc.
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
import { GlobalEventListener } from "../../components/global-event-listener/global-event-listener";
import { classNames, enterKey } from "../../utils/dom/dom";
import { SvgIcon } from "../svg-icon/svg-icon";
import "./reloader.scss";

export interface ReloaderProps {
  onReload: () => void;
}

export class Reloader extends React.Component<ReloaderProps> {
  protected globalKeyDownListener = (e: KeyboardEvent) => {
    if (e.metaKey && enterKey(e)) {
      this.props.onReload();
      e.preventDefault();
      e.stopPropagation();
    }
  }

  render() {
    const { onReload } = this.props;

    return <div className="reloader" onClick={onReload}>
      <GlobalEventListener keyDown={this.globalKeyDownListener} />
      <SvgIcon svg={require("../../icons/full-refresh.svg")} />
      <span>Click to load data or use Cmd+Enter</span>
    </div>;
  }
}
