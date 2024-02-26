'use client'
import { useState, useEffect } from 'react';

import axios from 'axios';

import { Box, Button } from '@mui/material';
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
        valueOptions: [
            {value: "owner", label: "Owner"},
            {value: "admin", label: "Admin"},
            {value: "user", label: "User"}
        ],
        value: 'hi',
        flex: 1,
        editable: true,
        headerAlign: 'center',
        align: 'center',
    },
];  

const Admin = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get(MACHINE_IP + ":5000" + "/api/firebase/getUsers").then((res) => {
            let tmpUsers = res.data["users"];
            tmpUsers = tmpUsers.map((user) => {
                user["id"] = user["uid"]
                delete user["uid"]
                return user
            });
            console.log(tmpUsers);
            setUsers(tmpUsers);
        })
    }, []);
    return (
        <Box sx={{ margin: "auto",width: "66vw", height: "75vh", position: "relative"}}>
            Welcome to the Admin Dashboard!
            <DataGrid 
                rows={users}
                columns={columns}
                autoPageSize
                disableRowSelectionOnClick
                isCellEditable={(params) => params.row.role != "owner"}
                sx={{ display: 'flex', justifyContent: 'left', alignItems: 'left' }}
            />
            <Button 
                variant="outlined"
                sx={{position: "absolute", right: 0, marginTop: "1rem"}}
                >
                    UPDATE ROLES
            </Button>
        </Box>
    )
}

export default Admin;