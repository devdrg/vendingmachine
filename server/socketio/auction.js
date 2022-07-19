// const { markVisited } = require("../services/websocket/auction");
const { placeABid, deleteABid } = require("../services/websocket/auction");
const { extendAuction } = require("../services/websocket/auction");

module.exports = (io, socket) => {
    console.log("socketio");
    
    // console.log(io);
    // console.log(socket);
    // live bidding
    socket.on("joinBidding", function (data) {
        console.log(`dataroom: ${data.room}`);
        socket.join(data.room);
    });

    socket.on("extendAuction", async (data, errorCall) => {
        // console.log(`dataroom: ${data.room}`);
        // socket.join(data.room);
        // console.log("extended");
        // console.log(data);
        const response = await extendAuction(data.roomId, data.days, socket.request.user);
        console.log(response)
        if (!response.success) {
            console.log("eroare prelungire licitatie");
            errorCall(response.msg);
        } else {
            console.log("Licitatie prelungita cu succes");
            io.emit("refreshBidHistory");
            io.in(data.roomId).emit("auctionExtended", response.newEndDate, data.roomId);
            // if (response.prevTopBidderId) {
            //     socket.to(response.prevTopBidderId).emit("chatUserBidInfo", { roomId: data.roomId, auctionName: response.auctionName });
            // }
        }
        // io.emit("refreshBidHistory");
        // console.log(Object.keys(io.sockets.in(data.roomId).connected));
    });

    // socket.on("test", (data) => {
    //     console.log(data);
    //     console.log("testare");
    // });

    socket.on("liveBid", async (data, errorCall) => {
        console.log("live bid merge");
        console.log(data.roomId);
        console.log(data.bid)
        // console.log(socket.rooms);
        // console.log(socket.request.user)
        const response = await placeABid(data.roomId, data.bid, data.user);
        if (response.msg !== undefined) {
            console.log("eroare place a bid");
            errorCall(response.msg);
        } else {
            console.log("place a bid merge");
            io.in(data.roomId).emit("sendBid", response.newBid, data.roomId);
            if (response.prevTopBidderId) {
                socket.to(response.prevTopBidderId).emit("chatUserBidInfo", { roomId: data.roomId, auctionName: response.auctionName });
            }
        }
        io.emit("refreshBidHistory");
        // console.log(Object.keys(io.sockets.in(data.roomId).connected));
    });

    socket.on("deleteBid", async (data, errorCall) => {
        console.log("delete bid merge");
        console.log(data.roomId);
        console.log(data.bid)
        console.log(socket.rooms);
        console.log(socket.request.user)

        const response = await deleteABid(data.roomId, data.bid, data.user);
        if (response.msg !== undefined) {
            console.log("eroare delete a bid");
            errorCall(response.msg);
        } else {
            console.log("delete a bid merge");
            io.in(data.roomId).emit("sendBid", response.newBid, data.roomId);
            if (response.prevTopBidderId) {
                socket.to(response.prevTopBidderId).emit("chatUserBidInfo", { roomId: data.roomId, auctionName: response.auctionName });
            }
        }

        io.emit("refreshBidHistory");
        // console.log(Object.keys(io.sockets.in(data.roomId).connected));
    });

    socket.on("markAuctionVisited", async (data, errorCall) => {
        console.log("mark visit merge");
        // console.log(data);

        // const response = await markVisited(data.roomId, data.visitor);
        // const response = await markVisited(data);
        // const response = await this.$http.post("/api/offers", data, { headers: { Authorization: localStorage.getItem("token") } });
        console.log('response is');
        // console.log(response);
        console.log("------")
        // if (response.msg !== undefined) {
        //     console.log("eroare mark a visit");
        //     errorCall(response.msg);
        // } else {
        //     console.log("mark a visit merge");
        //     // io.in(data.roomId).emit("sendBid", response.newBid, data.roomId);
        //     // if (response.prevTopBidderId) {
        //     //     socket.to(response.prevTopBidderId).emit("chatUserBidInfo", { roomId: data.roomId, auctionName: response.auctionName });
        //     // }
        // }
        // // io.emit("refreshBidHistory");
        // // console.log(Object.keys(io.sockets.in(data.roomId).connected));
    });

    socket.on("leaveBidding", function (data) {
        socket.leave(data.room);
    });

    // io.sockets.emit("test", {});
    // socket.emit("test", {});
};
