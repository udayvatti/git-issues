import { FunctionComponent, useEffect, useState } from "react";
import { Alert, Container } from "react-bootstrap";
import ListGroup from "react-bootstrap/ListGroup";

export const List: FunctionComponent<{}> = ({}) => {
  const [list, setList] = useState<any[]>([]);
  const [alert, setAlert] = useState<string | null>(null);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    Promise.all([
      fetch("https://api.github.com/repos/microsoft/TypeScript/issues"),
      fetch("https://api.github.com/repos/facebook/react/issues"),
      fetch("https://api.github.com/repos/graphql/graphql-js/issues"),
    ])
      .then((responses) => {
        return Promise.all(
          responses.map(function (response) {
            return response.json();
          })
        );
      })
      .then((data) => {
        let sortedList: any[] = [];
        data.forEach((value) => {
          if (!value.message) {
            sortedList.push(
              value.filter((issue: any) => {
                return !issue["pull_request"];
              })
            );
          }
        });

        setList(
          [].concat.apply([], sortedList).sort((a: any, b: any) => {
            return a.title
              .toLowerCase()
              .replace(/[^a-z0-9]/g, "")
              .localeCompare(b.title.toLowerCase().replace(/[^a-z0-9]/g, ""));
          })
        );
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const getRepositoryName = (url: String) => {
    return url.substring(url.lastIndexOf("/") + 1);
  };

  const deleteIssue = (i: number) => {
    setAlert("Succesfully Deleted");
    setList(
      list.filter((val, index) => {
        return index !== i;
      })
    );

    setTimeout(() => {
      setAlert(null);
    }, 1400);
  };

  return (
    <div className=" my-3">
      <Container className="list-container">
        <h3 className="mb-3">Issues List</h3>
        {alert ? (
          <div className="alert-box">
            <Alert variant="success">{alert}</Alert>
          </div>
        ) : null}
        <ListGroup>
          {list.map((issue: any, index) => {
            return (
              <ListGroup.Item
                key={index}
                className="d-flex flex-row list-item justify-content-between"
              >
                <div>
                  <a
                    href={issue.html_url}
                    target="_blank"
                    className="text-dark"
                  >
                    <h6 className="list-title text-left">{issue.title}</h6>
                  </a>
                  <div>
                    <a
                      href={issue.repository_url
                        .replace("api.", "")
                        .replace("/repos", "")}
                      target="_blank"
                    >
                      Repository: {getRepositoryName(issue.repository_url)}
                    </a>
                  </div>
                  <div className="user-details">
                    <a href={issue.user.html_url} target="_blank">
                      <i>issue opened by {issue.user.login}</i>
                      <img src={issue.user.avatar_url} className="user-icon" /><br/>
                      <small>{issue.user.html_url}</small>
                    </a>

                  </div>
                </div>
                <div className="list-action">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      deleteIssue(index);
                    }}
                  >
                    DELETE
                  </button>
                </div>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </Container>
    </div>
  );
};
