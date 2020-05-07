
import { Button, Card, CardActions, CardContent, createStyles, Grid, LinearProgress, makeStyles, Theme, Typography } from '@material-ui/core';
import clsx from "clsx";
import React from "react";
import { connect, ConnectedProps, useSelector } from 'react-redux';
import { setActiveProject } from "../../store/organisations/actions";
import { getFetchingProjects, getProjects, getUpdateProjectLoader } from "../../store/projects/selector";
import { ProjectType } from "../../store/projects/types";
import { getActiveOrg, getActiveProject } from "../../store/selectors";
import ContentLoading from '../ContentLoading';
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: theme.spacing(3),
        },
        title: {
            fontSize: 20,
        }
    })
);

function Projects(props: ProjectProps) {
    const classes = useStyles();
    const projects = useSelector(getProjects);
    const projectsLoading = useSelector(getFetchingProjects);
    const activeOrg = useSelector(getActiveOrg);
    const activeProject = useSelector(getActiveProject);
    const updateProjectLoader = useSelector(getUpdateProjectLoader);

    const getButton = (id: string) => {
        if (activeProject !== id)
            return <Button variant="contained" color="primary" onClick={() => props.setActiveProject(String(activeOrg), id)}>Make Active</Button>
        return <Button variant="contained" color="secondary" disabled onClick={() => props.setActiveProject(String(activeOrg), id)}>Active</Button>
    }

    const getCard = (project: ProjectType) => {
        return (
            <Grid key={project.id} item xs={12} sm={3}>
                <Card>
                    {project.id === activeProject && updateProjectLoader && <LinearProgress />}
                    <CardContent>
                        <Typography className={classes.title} color="textPrimary" gutterBottom>
                            {project.name}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        {getButton(project.id)}
                    </CardActions>
                </Card>
            </Grid >
        )
    }

    const renderProjects = () => {
        if (projectsLoading) {
            return <ContentLoading />
        }
        if (projects.length === 0) {
            return <Typography align='center' variant="h6">{"No projects found"}</Typography>
        }
        return <Grid container spacing={1}>
            {projects.map((project) => getCard(project))}
        </Grid>
    }

    return (
        <div>
            <Card className={clsx(classes.root)}>
                <Typography variant="h4">{"Projects"}</Typography>
                {renderProjects()}
            </Card>
        </div>
    )
}

const mapStateToProps = () => ({})

const mapDispatchToProps = (dispatch: any) => ({
    setActiveProject: (orgId: string, projectId: string) => dispatch(setActiveProject(orgId, projectId)),
})

const connector = connect(mapStateToProps, mapDispatchToProps)
type ProjectProps = ConnectedProps<typeof connector>

export default connector(Projects)

