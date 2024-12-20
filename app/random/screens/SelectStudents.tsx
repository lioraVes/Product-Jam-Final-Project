"use client";

import { useEffect, useState } from "react";
import { STATE_TRANSITION_ANIMATION_DURATION } from "../constants";
import { selectStudents } from "../logic";
import type {
  AssignedTeam,
  Data,
  SetCurrentTeamMembers,
  StateDescriptor,
  TransitionStateFunction,
} from "../types";
import SessionAction from "../components/SessionAction";
import StudentList from "../components/StudentList";
import Wrapper from "../components/Wrapper";

interface Props {
  data: Data;
  teams: AssignedTeam[];
  assignedStudents: number[];
  currentTeamMembers: number[];
  stateDescriptor: StateDescriptor;
  setCurrentTeamMembers: SetCurrentTeamMembers;
  transitionToStateFn: TransitionStateFunction;
}

export default function SelectStudents({
  data,
  teams,
  assignedStudents,
  currentTeamMembers,
  stateDescriptor,
  setCurrentTeamMembers,
  transitionToStateFn,
}: Props) {
  const [actionDisabled, setActionDisabled] = useState(
    stateDescriptor.action.disabled
  );

  useEffect(() => {
    setTimeout(() => {
      const teamDistribution = data.distribution[teams.length];
      setCurrentTeamMembers(
        selectStudents(data.students, assignedStudents, teamDistribution)
      );
      setActionDisabled(false);
    }, STATE_TRANSITION_ANIMATION_DURATION);
  }, [
    data.students,
    data.distribution,
    assignedStudents,
    teams,
    setCurrentTeamMembers,
  ]);

  function actionHandler() {
    transitionToStateFn(stateDescriptor.next);
  }

  return (
    <Wrapper>
      <StudentList
        animate={!actionDisabled}
        groups={data.groups}
        students={data.students}
        currentTeamMembers={currentTeamMembers}
        assignedStudents={assignedStudents}
      />
      <SessionAction
        handler={actionHandler}
        id={stateDescriptor.action.id}
        text={stateDescriptor.action.text}
        disabled={actionDisabled}
      />
    </Wrapper>
  );
}
