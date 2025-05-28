/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const market_data = $root.market_data = (() => {

    /**
     * Namespace market_data.
     * @exports market_data
     * @namespace
     */
    const market_data = {};

    market_data.TickerUpdate = (function() {

        /**
         * Properties of a TickerUpdate.
         * @memberof market_data
         * @interface ITickerUpdate
         * @property {string|null} [symbol] TickerUpdate symbol
         * @property {string|null} [lastPrice] TickerUpdate lastPrice
         * @property {number|Long|null} [eventTime] TickerUpdate eventTime
         */

        /**
         * Constructs a new TickerUpdate.
         * @memberof market_data
         * @classdesc Represents a TickerUpdate.
         * @implements ITickerUpdate
         * @constructor
         * @param {market_data.ITickerUpdate=} [properties] Properties to set
         */
        function TickerUpdate(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * TickerUpdate symbol.
         * @member {string} symbol
         * @memberof market_data.TickerUpdate
         * @instance
         */
        TickerUpdate.prototype.symbol = "";

        /**
         * TickerUpdate lastPrice.
         * @member {string} lastPrice
         * @memberof market_data.TickerUpdate
         * @instance
         */
        TickerUpdate.prototype.lastPrice = "";

        /**
         * TickerUpdate eventTime.
         * @member {number|Long} eventTime
         * @memberof market_data.TickerUpdate
         * @instance
         */
        TickerUpdate.prototype.eventTime = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new TickerUpdate instance using the specified properties.
         * @function create
         * @memberof market_data.TickerUpdate
         * @static
         * @param {market_data.ITickerUpdate=} [properties] Properties to set
         * @returns {market_data.TickerUpdate} TickerUpdate instance
         */
        TickerUpdate.create = function create(properties) {
            return new TickerUpdate(properties);
        };

        /**
         * Encodes the specified TickerUpdate message. Does not implicitly {@link market_data.TickerUpdate.verify|verify} messages.
         * @function encode
         * @memberof market_data.TickerUpdate
         * @static
         * @param {market_data.ITickerUpdate} message TickerUpdate message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TickerUpdate.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.symbol != null && Object.hasOwnProperty.call(message, "symbol"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.symbol);
            if (message.lastPrice != null && Object.hasOwnProperty.call(message, "lastPrice"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.lastPrice);
            if (message.eventTime != null && Object.hasOwnProperty.call(message, "eventTime"))
                writer.uint32(/* id 3, wireType 0 =*/24).int64(message.eventTime);
            return writer;
        };

        /**
         * Encodes the specified TickerUpdate message, length delimited. Does not implicitly {@link market_data.TickerUpdate.verify|verify} messages.
         * @function encodeDelimited
         * @memberof market_data.TickerUpdate
         * @static
         * @param {market_data.ITickerUpdate} message TickerUpdate message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TickerUpdate.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a TickerUpdate message from the specified reader or buffer.
         * @function decode
         * @memberof market_data.TickerUpdate
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {market_data.TickerUpdate} TickerUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TickerUpdate.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.market_data.TickerUpdate();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.symbol = reader.string();
                        break;
                    }
                case 2: {
                        message.lastPrice = reader.string();
                        break;
                    }
                case 3: {
                        message.eventTime = reader.int64();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a TickerUpdate message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof market_data.TickerUpdate
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {market_data.TickerUpdate} TickerUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TickerUpdate.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a TickerUpdate message.
         * @function verify
         * @memberof market_data.TickerUpdate
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        TickerUpdate.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.symbol != null && message.hasOwnProperty("symbol"))
                if (!$util.isString(message.symbol))
                    return "symbol: string expected";
            if (message.lastPrice != null && message.hasOwnProperty("lastPrice"))
                if (!$util.isString(message.lastPrice))
                    return "lastPrice: string expected";
            if (message.eventTime != null && message.hasOwnProperty("eventTime"))
                if (!$util.isInteger(message.eventTime) && !(message.eventTime && $util.isInteger(message.eventTime.low) && $util.isInteger(message.eventTime.high)))
                    return "eventTime: integer|Long expected";
            return null;
        };

        /**
         * Creates a TickerUpdate message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof market_data.TickerUpdate
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {market_data.TickerUpdate} TickerUpdate
         */
        TickerUpdate.fromObject = function fromObject(object) {
            if (object instanceof $root.market_data.TickerUpdate)
                return object;
            let message = new $root.market_data.TickerUpdate();
            if (object.symbol != null)
                message.symbol = String(object.symbol);
            if (object.lastPrice != null)
                message.lastPrice = String(object.lastPrice);
            if (object.eventTime != null)
                if ($util.Long)
                    (message.eventTime = $util.Long.fromValue(object.eventTime)).unsigned = false;
                else if (typeof object.eventTime === "string")
                    message.eventTime = parseInt(object.eventTime, 10);
                else if (typeof object.eventTime === "number")
                    message.eventTime = object.eventTime;
                else if (typeof object.eventTime === "object")
                    message.eventTime = new $util.LongBits(object.eventTime.low >>> 0, object.eventTime.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from a TickerUpdate message. Also converts values to other types if specified.
         * @function toObject
         * @memberof market_data.TickerUpdate
         * @static
         * @param {market_data.TickerUpdate} message TickerUpdate
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TickerUpdate.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.symbol = "";
                object.lastPrice = "";
                if ($util.Long) {
                    let long = new $util.Long(0, 0, false);
                    object.eventTime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.eventTime = options.longs === String ? "0" : 0;
            }
            if (message.symbol != null && message.hasOwnProperty("symbol"))
                object.symbol = message.symbol;
            if (message.lastPrice != null && message.hasOwnProperty("lastPrice"))
                object.lastPrice = message.lastPrice;
            if (message.eventTime != null && message.hasOwnProperty("eventTime"))
                if (typeof message.eventTime === "number")
                    object.eventTime = options.longs === String ? String(message.eventTime) : message.eventTime;
                else
                    object.eventTime = options.longs === String ? $util.Long.prototype.toString.call(message.eventTime) : options.longs === Number ? new $util.LongBits(message.eventTime.low >>> 0, message.eventTime.high >>> 0).toNumber() : message.eventTime;
            return object;
        };

        /**
         * Converts this TickerUpdate to JSON.
         * @function toJSON
         * @memberof market_data.TickerUpdate
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        TickerUpdate.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for TickerUpdate
         * @function getTypeUrl
         * @memberof market_data.TickerUpdate
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        TickerUpdate.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/market_data.TickerUpdate";
        };

        return TickerUpdate;
    })();

    market_data.TickerList = (function() {

        /**
         * Properties of a TickerList.
         * @memberof market_data
         * @interface ITickerList
         * @property {Array.<market_data.ITickerUpdate>|null} [tickers] TickerList tickers
         */

        /**
         * Constructs a new TickerList.
         * @memberof market_data
         * @classdesc Represents a TickerList.
         * @implements ITickerList
         * @constructor
         * @param {market_data.ITickerList=} [properties] Properties to set
         */
        function TickerList(properties) {
            this.tickers = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * TickerList tickers.
         * @member {Array.<market_data.ITickerUpdate>} tickers
         * @memberof market_data.TickerList
         * @instance
         */
        TickerList.prototype.tickers = $util.emptyArray;

        /**
         * Creates a new TickerList instance using the specified properties.
         * @function create
         * @memberof market_data.TickerList
         * @static
         * @param {market_data.ITickerList=} [properties] Properties to set
         * @returns {market_data.TickerList} TickerList instance
         */
        TickerList.create = function create(properties) {
            return new TickerList(properties);
        };

        /**
         * Encodes the specified TickerList message. Does not implicitly {@link market_data.TickerList.verify|verify} messages.
         * @function encode
         * @memberof market_data.TickerList
         * @static
         * @param {market_data.ITickerList} message TickerList message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TickerList.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.tickers != null && message.tickers.length)
                for (let i = 0; i < message.tickers.length; ++i)
                    $root.market_data.TickerUpdate.encode(message.tickers[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified TickerList message, length delimited. Does not implicitly {@link market_data.TickerList.verify|verify} messages.
         * @function encodeDelimited
         * @memberof market_data.TickerList
         * @static
         * @param {market_data.ITickerList} message TickerList message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TickerList.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a TickerList message from the specified reader or buffer.
         * @function decode
         * @memberof market_data.TickerList
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {market_data.TickerList} TickerList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TickerList.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.market_data.TickerList();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.tickers && message.tickers.length))
                            message.tickers = [];
                        message.tickers.push($root.market_data.TickerUpdate.decode(reader, reader.uint32()));
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a TickerList message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof market_data.TickerList
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {market_data.TickerList} TickerList
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TickerList.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a TickerList message.
         * @function verify
         * @memberof market_data.TickerList
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        TickerList.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.tickers != null && message.hasOwnProperty("tickers")) {
                if (!Array.isArray(message.tickers))
                    return "tickers: array expected";
                for (let i = 0; i < message.tickers.length; ++i) {
                    let error = $root.market_data.TickerUpdate.verify(message.tickers[i]);
                    if (error)
                        return "tickers." + error;
                }
            }
            return null;
        };

        /**
         * Creates a TickerList message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof market_data.TickerList
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {market_data.TickerList} TickerList
         */
        TickerList.fromObject = function fromObject(object) {
            if (object instanceof $root.market_data.TickerList)
                return object;
            let message = new $root.market_data.TickerList();
            if (object.tickers) {
                if (!Array.isArray(object.tickers))
                    throw TypeError(".market_data.TickerList.tickers: array expected");
                message.tickers = [];
                for (let i = 0; i < object.tickers.length; ++i) {
                    if (typeof object.tickers[i] !== "object")
                        throw TypeError(".market_data.TickerList.tickers: object expected");
                    message.tickers[i] = $root.market_data.TickerUpdate.fromObject(object.tickers[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a TickerList message. Also converts values to other types if specified.
         * @function toObject
         * @memberof market_data.TickerList
         * @static
         * @param {market_data.TickerList} message TickerList
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TickerList.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.tickers = [];
            if (message.tickers && message.tickers.length) {
                object.tickers = [];
                for (let j = 0; j < message.tickers.length; ++j)
                    object.tickers[j] = $root.market_data.TickerUpdate.toObject(message.tickers[j], options);
            }
            return object;
        };

        /**
         * Converts this TickerList to JSON.
         * @function toJSON
         * @memberof market_data.TickerList
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        TickerList.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for TickerList
         * @function getTypeUrl
         * @memberof market_data.TickerList
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        TickerList.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/market_data.TickerList";
        };

        return TickerList;
    })();

    return market_data;
})();

export { $root as default };
