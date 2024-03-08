'use client'
import { useState, useEffect, useContext } from 'react';

import { UserAuthContext } from '../context/user.context';

import axios from 'axios';

import { Typography, Box, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { MACHINE_IP } from "@/utils/machine-ip";


const columns = [
    {
        field: 'id',
        headerName: 'UID',
        type: 'number',
        flex: 1,
        editable: false,
        headerAlign: 'left',
        align: 'left',
    },
    { 
        field: 'email', 
        headerName: 'Email',
        type: 'string', 
        flex: 1,
        editable: false,
        headerAlign: 'left',
        align: 'left',
    },
    {
        field: 'role',
        headerName: 'Role',
        type: 'singleSelect',
        valueOptions: ({ row }) => {
            if (row.role == "owner") {
                return [{value: "owner", label: "Owner"}]
            } else {
                return [
                    {value: "admin", label: "Admin"},
                    {value: "user", label: "User"}
                ]
            }
        },
        value: 'hi',
        flex: 1,
        editable: true,
        headerAlign: 'center',
        align: 'center',
    },
];  



const Admin = () => {
    const [users, setUsers] = useState([]);
    const [errors, setErrors] = useState([]);
    const [wasRoleUpdated, setWasRoleUpdated] = useState(false);
    const { userJWTToken } = useContext(UserAuthContext);

    // Sets the rows for the datagrid.
    useEffect(() => {
        axios.get(MACHINE_IP + ":5000" + "/api/firebase/getUsers").then((res) => {
            let tmpUsers = res.data["users"];
            tmpUsers = tmpUsers.map((user) => {
                user["id"] = user["uid"]
                delete user["uid"]
                return user
            });

            setUsers(tmpUsers);
        })
    }, []);

    const onCellEditCommit = (newRow, oldRow) => {    
        let updatedUsers = users.map((user) => {
            if (user.id == newRow.id) {
                setWasRoleUpdated(true);
                user.role = newRow.role;
                user.updated = true;
            }
            return user;
        })
        setUsers(updatedUsers);
        return newRow;
    }

    const handleRoleUpdates = () => {
        console.log(users)
        users.map((user) => {
            if (user.updated) {
                let data = {
                    JWT_TOKEN: userJWTToken,
                    uid: user.id,
                    role: user.role
                }
                axios.post(MACHINE_IP + ":5000" + "/api/firebase/updateUserRole", data).then(() => {
                    setWasRoleUpdated(false);
                    console.log("Updated user role successfully.")
                }).catch((err) => {
                    let statusCode = err.response.status;
                    if (statusCode == 403) {
                        setErrors([...errors, "Permission denied. Please login."])
                        console.log("Permission denied.")
                    } else if (statusCode == 400 ) {
                        setErrors([...errors, "Invalid request. Please refresh and try again."])
                        console.log("Invalid option. Please refresh and try again.")
                    } else {
                        setErrors([...errors, "Failed to update user's role. Contact james."])
                        console.log("Failed to update user's role. Contact james.", err)
                    }  
                })
            }
        })
    }


    return (
        <Box sx={{ margin: "auto", width: "66vw", height: "75vh", position: "relative", pb: '8rem'}}>
            <Typography>Welcome to the Admin Dashboard!</Typography>
            <DataGrid 
                rows={users}
                columns={columns}
                autoPageSize
                disableRowSelectionOnClick
                processRowUpdate={onCellEditCommit}
                onProcessRowUpdateError={(error) => {console.log("Error occurred trying to update role value,", error)}}
                sx={{ display: 'flex', justifyContent: 'left', alignItems: 'left' }}
            />
            <Button 
                onClick={handleRoleUpdates}
                variant="outlined"
                disabled={!wasRoleUpdated}
                sx={{position: "absolute", right: 0, marginTop: "1rem"}}
                >
                    UPDATE ROLES
            </Button>
        </Box>
    )
}

export default Admin;