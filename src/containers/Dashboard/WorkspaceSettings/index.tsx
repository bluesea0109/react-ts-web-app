import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Button } from '@bavard/react-components';
import {
  Box,
  Grid,
  makeStyles,
  Theme,
  Typography,
  Paper,
  Tabs,
  Tab,
} from '@material-ui/core';
import { AddCircleOutline, PersonAdd, Group } from '@material-ui/icons';
import { GET_WORKSPACES } from '../../../common-gql-queries';
import {
  IWorkspace,
  IUser,
  IInvitedMember,
} from '../../../models/user-service';
import ApolloErrorPage from '../../ApolloErrorPage';
import ContentLoading from '../../ContentLoading';
import InviteDialog from './InviteDialog';
import WorkspaceInvitedMember from './WorkspaceInvitedMember';
import WorkspaceMembersTable from './WorkspaceMembersTable';
import DisablePaymentDialog from './DisablePaymentDialog';
import EnablePaymentDialog from './EnablePaymentDialog';
import ApiKeys from './ApiKeys';
import { GET_INVITED_WORKSPACE_MEMBERS } from './gql';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingRight: '50px',
  },
  tableWrapper: {
    display: 'flex',
  },
  paper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: theme.spacing(1),
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  pageTitle: {
    fontSize: '26px',
    marginTop: '20px',
    marginBottom: theme.spacing(3),
  },
  tabRoot: {
    maxWidth: '100%',
  },
  tabIcon: {
    paddingRight: theme.spacing(1),
  },
  tabWrapper: {
    textTransform: 'none',
    '& .MuiTab-wrapper': {
      flexDirection: 'row',
    },
  },
  roundCornerResolver: {
    '& .MuiPaper-rounded': {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
    },
  },
}));

interface IWorkspaceSettingsProps {
  user: IUser;
  workspaceId?: String;
}

interface IGetWorkspaces {
  workspaces: IWorkspace[];
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

interface IInvitedMemberProps {
  workspaceMemberInvites: IInvitedMember[] | undefined;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tab-panel-${index}`}
      {...other}>
      {value === index && children}
    </div>
  );
}

export default function WorkspaceSettings(props: IWorkspaceSettingsProps) {
  const classes = useStyles();

  const invitedMemberData = useQuery<IInvitedMemberProps>(
    GET_INVITED_WORKSPACE_MEMBERS,
    { variables: { workspaceId: props.workspaceId } },
  );

  const invitedMembers: IInvitedMember[] | undefined =
    invitedMemberData.data?.workspaceMemberInvites;

  const { error, loading, data, refetch } = useQuery<IGetWorkspaces>(
    GET_WORKSPACES,
    {
      variables: { id: props.workspaceId },
    },
  );

  const [viewInviteDialog, showInviteDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const handleChangeTab = (_: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  };

  const handleShowInviteDialog = () => {
    showInviteDialog(true);
  };

  if (error) {
    return <ApolloErrorPage error={error} />;
  }

  if (loading || !data) {
    return <ContentLoading shrinked={true} />;
  }

  if (data.workspaces.length === 0) {
    return <Typography>{'Error: failed to load workspace data'}</Typography>;
  }

  const workspace = data.workspaces[0];
  return (
    <div>
      <Grid
        item={true}
        container={true}
        xs={12}
        spacing={2}
        className={classes.root}>
        <Grid item={true} xs={12} sm={12}>
          <Paper className={classes.paper}>
            <Tabs
              value={tabValue}
              onChange={handleChangeTab}
              className={classes.tabRoot}>
              <Tab
                icon={<Group className={classes.tabIcon} />}
                label="Team Members"
                className={classes.tabWrapper}
              />
              <Tab
                icon={<PersonAdd className={classes.tabIcon} />}
                label={<span>Invited Team Members</span>}
                className={classes.tabWrapper}
              />
            </Tabs>
            {tabValue === 1 ? (
              <Button
                color="primary"
                title="Invite a Member"
                variant="text"
                RightIcon={AddCircleOutline}
                onClick={handleShowInviteDialog}
              />
            ) : workspace.billingEnabled === true ? (
              <DisablePaymentDialog />
            ) : (
              <EnablePaymentDialog />
            )}
          </Paper>
          <TabPanel value={tabValue} index={0}>
            <Box className={classes.roundCornerResolver}>
              <WorkspaceMembersTable
                user={props.user}
                workspace={workspace}
                refetchWorkspaces={refetch}
              />
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box className={classes.roundCornerResolver}>
              <WorkspaceInvitedMember
                workspaceId={props.workspaceId}
                invitedMembers={invitedMembers}
              />
            </Box>
            {viewInviteDialog && (
              <InviteDialog
                open={viewInviteDialog}
                onClose={() => showInviteDialog(false)}
                onSuccess={() => showInviteDialog(false)}
                user={props.user}
                workspaceId={props.workspaceId}
              />
            )}
          </TabPanel>
        </Grid>
      </Grid>
      <Grid
        item={true}
        container={true}
        xs={12}
        sm={12}
        spacing={2}
        className={classes.root}>
        <ApiKeys workspaceId={props.workspaceId} />
      </Grid>
    </div>
  );
}
